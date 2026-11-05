import Dexie from 'dexie';
import { DEFAULT_AISLE } from './lib/constants.js';
import { guessAisle } from './lib/aisleGuess.js';
import { capitalize, normalizeName } from './lib/parse.js';
import { isWeekendOver, nearestSaturday } from './lib/week.js';

export const db = new Dexie('weekend-menu');

db.version(1).stores({
  products: '++id, &key, aisle',
  dishes: '++id, &key, category, is_draft, last_cooked_at',
  dishIngredients: '++id, dish_id, product_id',
  weekPlans: '++id, &sat_date, status',
  planItems: '++id, plan_id, dish_id, [plan_id+order]',
  shoppingOverrides: '++id, plan_id, product_id, [plan_id+product_id]',
});

const now = () => new Date().toISOString();

// ---------- F1. Week ----------

/** Close finished weekends and make sure the active plan for the nearest weekend exists. */
export async function ensureActivePlan(at = new Date()) {
  return db.transaction('rw', db.weekPlans, async () => {
    const actives = await db.weekPlans.where('status').equals('active').toArray();
    for (const p of actives) {
      if (isWeekendOver(p.sat_date, at)) {
        await db.weekPlans.update(p.id, { status: 'closed', closed_at: at.toISOString() });
      }
    }
    const sat = nearestSaturday(at);
    const existing = await db.weekPlans.where('sat_date').equals(sat).first();
    if (existing) {
      if (existing.status !== 'active') await db.weekPlans.update(existing.id, { status: 'active' });
      return existing.id;
    }
    return db.weekPlans.add({ sat_date: sat, status: 'active', created_at: at.toISOString() });
  });
}

// ---------- Products (F8) ----------

export async function getOrCreateProduct(name) {
  const key = normalizeName(name);
  const found = await db.products.where('key').equals(key).first();
  if (found) return found;
  const product = { key, name: capitalize(name), aisle: guessAisle(name) ?? DEFAULT_AISLE, default_unit: null };
  product.id = await db.products.add(product);
  return product;
}

export const setProductAisle = (id, aisle) => db.products.update(id, { aisle });

// ---------- Dishes (F3) ----------

export async function findOrCreateDish(name) {
  const key = normalizeName(name);
  const found = await db.dishes.where('key').equals(key).first();
  if (found) return found;
  const dish = { key, name: capitalize(name), category: null, note: '', is_draft: 1, last_cooked_at: null, created_at: now() };
  dish.id = await db.dishes.add(dish);
  return dish;
}

export async function updateDish(id, patch) {
  if (patch.name != null) patch = { ...patch, name: capitalize(patch.name), key: normalizeName(patch.name) };
  return db.dishes.update(id, patch);
}

export async function deleteDish(id) {
  await db.transaction('rw', db.dishes, db.dishIngredients, db.planItems, async () => {
    await db.dishIngredients.where('dish_id').equals(id).delete();
    await db.planItems.where('dish_id').equals(id).delete();
    await db.dishes.delete(id);
  });
}

export async function addIngredient(dishId, { name, qty, unit, note = '' }) {
  const product = await getOrCreateProduct(name);
  if (!product.default_unit && unit) await db.products.update(product.id, { default_unit: unit });
  await db.dishIngredients.add({ dish_id: dishId, product_id: product.id, qty, unit, note });
  await db.dishes.update(dishId, { is_draft: 0 });
}

export async function updateIngredient(id, patch) {
  return db.dishIngredients.update(id, patch);
}

export async function removeIngredient(id) {
  const ing = await db.dishIngredients.get(id);
  await db.dishIngredients.delete(id);
  if (ing && (await db.dishIngredients.where('dish_id').equals(ing.dish_id).count()) === 0) {
    await db.dishes.update(ing.dish_id, { is_draft: 1 });
  }
}

// ---------- Menu (F2, F4) ----------

export async function addDishToPlan(planId, dishId, day = null) {
  const items = await db.planItems.where('plan_id').equals(planId).toArray();
  if (items.some((i) => i.dish_id === dishId)) return null;
  const order = items.reduce((m, i) => Math.max(m, i.order), -1) + 1;
  return db.planItems.add({ plan_id: planId, dish_id: dishId, day, cooked: 0, order });
}

export async function quickAdd(planId, name) {
  const dish = await findOrCreateDish(name);
  await addDishToPlan(planId, dish.id);
  return dish;
}

export const setItemDay = (id, day) => db.planItems.update(id, { day });
export const removePlanItem = (id) => db.planItems.delete(id);

export async function setCooked(item, cooked) {
  await db.planItems.update(item.id, { cooked: cooked ? 1 : 0 });
  if (cooked) await db.dishes.update(item.dish_id, { last_cooked_at: now() });
}

/** Move an item up/down among items of the same day. */
export async function moveItem(planId, itemId, dir) {
  const items = (await db.planItems.where('plan_id').equals(planId).toArray()).sort((a, b) => a.order - b.order);
  const item = items.find((i) => i.id === itemId);
  const same = items.filter((i) => i.day === item.day);
  const idx = same.indexOf(item);
  const other = same[idx + dir];
  if (!other) return;
  await db.transaction('rw', db.planItems, async () => {
    await db.planItems.update(item.id, { order: other.order });
    await db.planItems.update(other.id, { order: item.order });
  });
}

// ---------- Shopping overrides (F6, F7) ----------

/** Upsert the override of a computed (menu-derived) line. */
export async function patchProductLine(planId, productId, patch) {
  const existing = await db.shoppingOverrides
    .where('[plan_id+product_id]').equals([planId, productId])
    .filter((o) => !o.is_manual).first();
  if (existing) return db.shoppingOverrides.update(existing.id, patch);
  return db.shoppingOverrides.add({
    plan_id: planId, product_id: productId, free_text: null,
    qty_override: null, have_at_home: 0, bought: 0, is_manual: 0, ...patch,
  });
}

export async function addManualLine(planId, { name, amount }) {
  const product = await getOrCreateProduct(name);
  return db.shoppingOverrides.add({
    plan_id: planId, product_id: product.id, free_text: product.name,
    qty_override: amount || null, have_at_home: 0, bought: 0, is_manual: 1,
  });
}

export const patchOverride = (id, patch) => db.shoppingOverrides.update(id, patch);
export const deleteOverride = (id) => db.shoppingOverrides.delete(id);

// ---------- Backup ----------

const TABLES = ['products', 'dishes', 'dishIngredients', 'weekPlans', 'planItems', 'shoppingOverrides'];

export async function exportAll() {
  const data = {};
  for (const t of TABLES) data[t] = await db[t].toArray();
  return { app: 'weekend-menu', version: 1, exported_at: now(), data };
}

export async function importAll(json) {
  if (json?.app !== 'weekend-menu' || !json.data) throw new Error('Это не резервная копия «Меню выходного дня»');
  await db.transaction('rw', TABLES.map((t) => db[t]), async () => {
    for (const t of TABLES) {
      await db[t].clear();
      await db[t].bulkAdd(json.data[t] ?? []);
    }
  });
}
