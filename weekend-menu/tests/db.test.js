import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  addIngredient, addManualLine, db, ensureActivePlan, exportAll, importAll, patchProductLine, quickAdd,
} from '../src/db.js';

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()));
});

describe('db', () => {
  it('rolls the week over after Sunday', async () => {
    const p1 = await ensureActivePlan(new Date(2026, 10, 4));
    expect(await ensureActivePlan(new Date(2026, 10, 8, 22))).toBe(p1);
    const p2 = await ensureActivePlan(new Date(2026, 10, 9, 8));
    expect(p2).not.toBe(p1);
    expect((await db.weekPlans.get(p1)).status).toBe('closed');
    expect((await db.weekPlans.get(p2)).sat_date).toBe('2026-11-14');
  });

  it('quick add creates a draft once and reuses products', async () => {
    const plan = await ensureActivePlan(new Date(2026, 10, 4));
    const d1 = await quickAdd(plan, 'перчики');
    const d2 = await quickAdd(plan, 'Перчики ');
    expect(d2.id).toBe(d1.id);
    expect(d1.is_draft).toBe(1);
    expect(await db.planItems.count()).toBe(1);

    await addIngredient(d1.id, { name: 'Фарш', qty: 0.5, unit: 'кг' });
    await addIngredient(d1.id, { name: 'фарш', qty: 0.2, unit: 'кг' });
    expect(await db.products.count()).toBe(1);
    expect((await db.products.toArray())[0].aisle).toBe('Мясо и птица');
    expect((await db.dishes.get(d1.id)).is_draft).toBe(0);
  });

  it('upserts overrides and survives export/import', async () => {
    const plan = await ensureActivePlan(new Date(2026, 10, 4));
    await patchProductLine(plan, 5, { bought: 1 });
    await patchProductLine(plan, 5, { have_at_home: 1 });
    await addManualLine(plan, { name: 'гранат', amount: '1 шт' });
    expect(await db.shoppingOverrides.count()).toBe(2);

    const backup = JSON.parse(JSON.stringify(await exportAll()));
    await Promise.all(db.tables.map((t) => t.clear()));
    await importAll(backup);
    expect(await db.shoppingOverrides.count()).toBe(2);
    expect(await db.products.count()).toBe(1);
  });
});

describe('seed: last menu (31 Oct – 1 Nov)', () => {
  it('loads once into history and the library, list matches the notes', async () => {
    const { seedWeek, repeatWeek } = await import('../src/db.js');
    const { LAST_MENU } = await import('../src/lib/seed.js');
    const { buildShoppingList, sourcesText } = await import('../src/lib/shopping.js');

    await Promise.all([seedWeek(LAST_MENU), seedWeek(LAST_MENU)]); // concurrent, like StrictMode
    expect(await seedWeek(LAST_MENU)).toBe(false);
    expect(await db.dishes.count()).toBe(7);

    const past = await db.weekPlans.where('sat_date').equals('2026-10-31').first();
    expect(past.status).toBe('closed');
    const toMap = (a) => new Map(a.map((x) => [x.id, x]));
    const list = buildShoppingList({
      planItems: await db.planItems.where('plan_id').equals(past.id).toArray(),
      dishes: toMap(await db.dishes.toArray()),
      ingredients: await db.dishIngredients.toArray(),
      products: toMap(await db.products.toArray()),
      overrides: await db.shoppingOverrides.where('plan_id').equals(past.id).toArray(),
    });
    const l = (n) => list.lines.find((x) => x.name === n);
    expect(l('Копчёная грудка').amount).toBe('4 шт');
    expect(sourcesText(l('Копчёная грудка').sources)).toBe('Суп 2, Салат Мадика 2');
    expect(l('Картофель').amount).toBe('5 кг');
    expect(l('Перец болгарский')).toMatchObject({ amount: '1 пакет', aisle: 'Овощи и фрукты' });
    expect(l('Гранат').amount).toBe('1 шт');
    expect(l('Огурцы').amount).toBe('1 кг');
    expect(list.missing.map((m) => m.name)).toEqual(['Курица запечённая', 'Стейк с сыром и помидором']);
    expect(list.lines).toHaveLength(11);

    // ensureActivePlan must not reopen the seeded past week, and «repeat» copies the menu over
    const current = await ensureActivePlan(new Date(2026, 10, 5));
    expect((await db.weekPlans.get(past.id)).status).toBe('closed');
    expect(await repeatWeek(past.id, current)).toBe(7);
    expect(await repeatWeek(past.id, current)).toBe(0);
  });
});

describe('calendar', () => {
  it('plans future weekends, moves dishes, keeps statuses on rollover', async () => {
    const { getOrCreatePlan, moveToPlan, toggleFavorite, previousPlanWithItems } = await import('../src/db.js');
    const now = new Date(2026, 10, 5);
    const cur = await ensureActivePlan(now);
    const next = await getOrCreatePlan('2026-11-14', now);
    const later = await getOrCreatePlan('2026-11-21', now);
    expect((await db.weekPlans.get(next)).status).toBe('planned');

    const d = await quickAdd(next, 'Плов');
    await toggleFavorite(d.id);
    expect((await db.dishes.get(d.id)).favorite).toBe(1);
    const item = await db.planItems.where('plan_id').equals(next).first();
    await moveToPlan(item, later);
    expect(await db.planItems.where('plan_id').equals(later).count()).toBe(1);
    expect(await db.planItems.where('plan_id').equals(next).count()).toBe(0);
    expect((await previousPlanWithItems('2026-11-28')).id).toBe(later);

    // next Monday: current closes, 14 Nov becomes active, 21 Nov stays planned
    const active = await ensureActivePlan(new Date(2026, 10, 9, 9));
    expect(active).toBe(next);
    expect((await db.weekPlans.get(cur)).status).toBe('closed');
    expect((await db.weekPlans.get(next)).status).toBe('active');
    expect((await db.weekPlans.get(later)).status).toBe('planned');
  });
});

describe('seed: menu 14–15 Nov', () => {
  it('adds the planned weekend; it becomes active when its week comes', async () => {
    const { seedWeek } = await import('../src/db.js');
    const { SEEDS } = await import('../src/lib/seed.js');
    for (const s of SEEDS) await seedWeek(s);
    await ensureActivePlan(new Date(2026, 10, 5));
    const plan = await db.weekPlans.where('sat_date').equals('2026-11-14').first();
    expect(plan.status).toBe('planned');
    const items = await db.planItems.where('plan_id').equals(plan.id).toArray();
    expect(items).toHaveLength(7);
    expect(await db.dishes.count()).toBe(14);
    await ensureActivePlan(new Date(2026, 10, 10));
    expect((await db.weekPlans.get(plan.id)).status).toBe('active');
  });
});

describe('editing a dish', () => {
  it('renaming an ingredient re-points it without touching other dishes', async () => {
    const { addIngredient, updateIngredient, updateDish } = await import('../src/db.js');
    const plan = await ensureActivePlan(new Date(2026, 10, 4));
    const a = await quickAdd(plan, 'Лагман');
    const b = await quickAdd(plan, 'Плов');
    await addIngredient(a.id, { name: 'Говядна', qty: 1, unit: 'кг' }); // typo
    await addIngredient(b.id, { name: 'Говядна', qty: 0.5, unit: 'кг' });
    const ing = await db.dishIngredients.where('dish_id').equals(a.id).first();
    await updateIngredient(ing.id, { name: 'Говядина', qty: 0.8, unit: 'кг', aisle: 'Мясо и птица' });
    const fixed = await db.dishIngredients.get(ing.id);
    expect((await db.products.get(fixed.product_id)).name).toBe('Говядина');
    expect(fixed.qty).toBe(0.8);
    const other = await db.dishIngredients.where('dish_id').equals(b.id).first();
    expect((await db.products.get(other.product_id)).name).toBe('Говядна');

    await updateDish(a.id, { name: 'лагман по-уйгурски' });
    expect((await db.dishes.get(a.id)).name).toBe('Лагман по-уйгурски');
    await expect(updateDish(a.id, { name: 'Плов' })).rejects.toThrow();
  });
});
