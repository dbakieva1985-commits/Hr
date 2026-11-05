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
