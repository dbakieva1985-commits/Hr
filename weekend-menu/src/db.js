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
db.version(2).stores({ meta: 'key' });

const now = () => new Date().toISOString();

// ---------- F1. Week ----------

/** Close finished weekends and make sure the active plan for the nearest weekend exists. */
export async function ensureActivePlan(at = new Date()) {
  return db.transaction('rw', db.weekPlans, async () => {
    const open = await db.weekPlans.where('status').anyOf('active', 'planned').toArray();
    for (const p of open) {
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

/** Plan for any weekend (calendar). Future weekends are 'planned' until they become the nearest one. */
export async function getOrCreatePlan(sat, at = new Date()) {
  const status = isWeekendOver(sat, at) ? 'closed' : sat === nearestSaturday(at) ? 'active' : 'planned';
  return db.transaction('rw', db.weekPlans, async () => {
    const existing = await db.weekPlans.where('sat_date').equals(sat).first();
    if (existing) return existing.id;
    return db.weekPlans.add({ sat_date: sat, status, created_at: at.toISOString() });
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

export async function toggleFavorite(dishId) {
  const dish = await db.dishes.get(dishId);
  if (dish) await db.dishes.update(dishId, { favorite: dish.favorite ? 0 : 1 });
}

/** U10: move a dish to another weekend. */
export async function moveToPlan(item, toPlanId) {
  if (item.plan_id === toPlanId) return;
  await db.transaction('rw', db.planItems, async () => {
    await addDishToPlan(toPlanId, item.dish_id, item.day);
    await db.planItems.delete(item.id);
  });
}

/** The most recent earlier weekend that had dishes (for «как в прошлый раз»). */
export async function previousPlanWithItems(sat) {
  const plans = (await db.weekPlans.toArray()).filter((p) => p.sat_date < sat).sort((a, b) => b.sat_date.localeCompare(a.sat_date));
  for (const p of plans) if ((await db.planItems.where('plan_id').equals(p.id).count()) > 0) return p;
  return null;
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

/** U12: put every dish of a past week into the active plan. Returns how many were added. */
export async function repeatWeek(fromPlanId, toPlanId) {
  const items = (await db.planItems.where('plan_id').equals(fromPlanId).toArray()).sort((a, b) => a.order - b.order);
  let added = 0;
  for (const i of items) if (await addDishToPlan(toPlanId, i.dish_id, i.day)) added += 1;
  return added;
}

// ---------- Starter data ----------

/**
 * Load a past week once (dishes + ingredients into the library, the menu into history,
 * extra purchases as manual list lines). Idempotent: guarded by a meta flag and by sat_date.
 */
export async function seedWeek(seed) {
  const flag = `seed:${seed.id}`;
  return db.transaction('rw', [db.meta, db.products, db.dishes, db.dishIngredients, db.weekPlans, db.planItems, db.shoppingOverrides], async () => {
    if (await db.meta.get(flag)) return false;
    const plan = await db.weekPlans.where('sat_date').equals(seed.sat_date).first();
    const planId = plan?.id ?? (await db.weekPlans.add({ sat_date: seed.sat_date, status: seed.status, created_at: now() }));
    for (const d of seed.dishes) {
      const dish = await findOrCreateDish(d.name);
      const patch = {};
      if (d.category && !dish.category) patch.category = d.category;
      if (d.note && !dish.note) patch.note = d.note;
      if (Object.keys(patch).length) await db.dishes.update(dish.id, patch);
      if ((await db.dishIngredients.where('dish_id').equals(dish.id).count()) === 0) {
        for (const ing of d.ingredients ?? []) await addIngredient(dish.id, ing);
      }
      await addDishToPlan(planId, dish.id, d.day ?? null);
    }
    for (const extra of seed.extras ?? []) {
      const product = await getOrCreateProduct(extra.name);
      await db.shoppingOverrides.add({
        plan_id: planId, product_id: product.id, free_text: product.name,
        qty_override: extra.amount, have_at_home: 0, bought: seed.status === 'closed' ? 1 : 0, is_manual: 1,
      });
    }
    await db.meta.put({ key: flag, at: now() });
    return true;
  });
}

// ---------- Backup ----------

const TABLES = ['products', 'dishes', 'dishIngredients', 'weekPlans', 'planItems', 'shoppingOverrides', 'meta'];

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
