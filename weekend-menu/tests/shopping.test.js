import { describe, expect, it } from 'vitest';
import { buildShoppingList, combineAmounts, groupByAisle, sourcesText } from '../src/lib/shopping.js';

// PRD acceptance test: борщ, суп, перчики, салат, курица, стейк, пюре.
const products = new Map([
  [1, { id: 1, name: 'Копчёная грудка', aisle: 'Мясо и птица' }],
  [2, { id: 2, name: 'Свекла', aisle: 'Овощи и фрукты' }],
  [3, { id: 3, name: 'Лук', aisle: 'Овощи и фрукты' }],
  [4, { id: 4, name: 'Маслины', aisle: 'Консервы и соусы' }],
  [5, { id: 5, name: 'Лимон', aisle: 'Овощи и фрукты' }],
  [6, { id: 6, name: 'Картофель', aisle: 'Овощи и фрукты' }],
  [7, { id: 7, name: 'Соль', aisle: 'Бакалея' }],
  [8, { id: 8, name: 'Говяжий стейк', aisle: 'Мясо и птица' }],
  [9, { id: 9, name: 'Огурец', aisle: 'Овощи и фрукты' }],
]);
const dishes = new Map(
  [
    [1, 'Борщ'], [2, 'Суп'], [3, 'Перчики'], [4, 'Салат'],
    [5, 'Курица'], [6, 'Стейк'], [7, 'Пюре'],
  ].map(([id, name]) => [id, { id, name }]),
);
const ingredients = [
  { dish_id: 1, product_id: 2, qty: 2, unit: 'шт' },
  { dish_id: 1, product_id: 3, qty: 2, unit: 'шт' },
  { dish_id: 1, product_id: 7, qty: null, unit: 'по вкусу' },
  { dish_id: 2, product_id: 1, qty: 2, unit: 'шт' },
  { dish_id: 2, product_id: 4, qty: 1, unit: 'пачка' },
  { dish_id: 2, product_id: 5, qty: 1, unit: 'шт' },
  { dish_id: 2, product_id: 3, qty: 200, unit: 'г' },
  { dish_id: 4, product_id: 1, qty: 2, unit: 'шт' },
  { dish_id: 4, product_id: 9, qty: 2, unit: 'шт' },
  { dish_id: 6, product_id: 8, qty: 0.8, unit: 'кг' },
  { dish_id: 6, product_id: 7, qty: null, unit: 'по вкусу' },
  { dish_id: 7, product_id: 6, qty: 1, unit: 'кг' },
  { dish_id: 7, product_id: 7, qty: null, unit: 'по вкусу' },
];
const planItems = [1, 2, 3, 4, 5, 6, 7].map((dish_id) => ({ dish_id }));

describe('buildShoppingList — PRD example', () => {
  const { lines, missing } = buildShoppingList({ planItems, dishes, ingredients, products });
  const line = (name) => lines.find((l) => l.name === name);

  it('sums the same product: грудка 4 шт (Суп 2, Салат 2)', () => {
    expect(line('Копчёная грудка').amount).toBe('4 шт');
    expect(sourcesText(line('Копчёная грудка').sources)).toBe('Суп 2, Салат 2');
  });

  it('different units stay on one line: Лук — 2 шт + 200 г', () => {
    expect(line('Лук').amount).toBe('2 шт + 200 г');
    expect(sourcesText(line('Лук').sources)).toBe('Борщ 2 шт, Суп 200 г');
  });

  it('«по вкусу» is not summed', () => {
    expect(line('Соль').amount).toBe('по вкусу');
    expect(line('Соль').sources.map((s) => s.dish)).toEqual(['Борщ', 'Стейк', 'Пюре']);
  });

  it('dishes without ingredients produce reminders', () => {
    expect(missing.map((m) => m.name)).toEqual(['Перчики', 'Курица']);
  });

  it('groups by aisle in canonical order', () => {
    expect(groupByAisle(lines).map((g) => g.aisle)).toEqual([
      'Овощи и фрукты', 'Мясо и птица', 'Бакалея', 'Консервы и соусы',
    ]);
  });
});

describe('overrides', () => {
  it('keeps manual edits and free items across rebuilds', () => {
    const overrides = [
      { id: 1, product_id: 1, qty_override: '3 шт', have_at_home: 0, bought: 1, is_manual: 0 },
      { id: 2, product_id: 5, qty_override: null, have_at_home: 1, bought: 0, is_manual: 0 },
      { id: 3, product_id: null, free_text: 'Гранат', qty_override: '1 шт', is_manual: 1 },
      { id: 4, product_id: 99, qty_override: '5 шт', is_manual: 0 }, // product left the menu
    ];
    const { lines } = buildShoppingList({ planItems, dishes, ingredients, products, overrides });
    const l = (n) => lines.find((x) => x.name === n);
    expect(l('Копчёная грудка')).toMatchObject({ amount: '3 шт', computedAmount: '4 шт', bought: true });
    expect(l('Лимон').haveAtHome).toBe(true);
    expect(l('Гранат')).toMatchObject({ amount: '1 шт', isManual: true, aisle: 'Другое' });
    expect(lines.some((x) => x.productId === 99)).toBe(false);
  });
});

describe('combineAmounts', () => {
  it('handles empty qty and fractions', () => {
    expect(combineAmounts([{ qty: 0.5, unit: 'кг' }, { qty: 0.25, unit: 'кг' }])).toBe('0,75 кг');
    expect(combineAmounts([{ qty: null, unit: 'шт' }])).toBe('');
    expect(combineAmounts([{ qty: 1, unit: 'шт' }, { qty: null, unit: 'по вкусу' }])).toBe('1 шт + по вкусу');
  });
});

import { shoppingText } from '../src/lib/shopping.js';
describe('shoppingText', () => {
  it('lists what is left by aisle', () => {
    const lines = [
      { name: 'Свекла', amount: '2 шт', aisle: 'Овощи и фрукты', bought: false, haveAtHome: false, sources: [{ dish: 'Борщ', amount: '2' }] },
      { name: 'Лимон', amount: '1 шт', aisle: 'Овощи и фрукты', bought: false, haveAtHome: true, sources: [] },
      { name: 'Грудка', amount: '4 шт', aisle: 'Мясо и птица', bought: true, haveAtHome: false, sources: [] },
      { name: 'Соль', amount: 'по вкусу', aisle: 'Бакалея', bought: false, haveAtHome: false, sources: [] },
    ];
    expect(shoppingText('Покупки на 14–15 ноября', lines)).toBe(
      '🛒 Покупки на 14–15 ноября\n\nОВОЩИ И ФРУКТЫ\n▫️ Свекла — 2 шт (для: Борщ)\n\nБАКАЛЕЯ\n▫️ Соль — по вкусу\n\nУже куплено: Грудка',
    );
  });
});

import { menuText } from '../src/lib/menuText.js';
describe('menuText', () => {
  it('lists each dish with its products', () => {
    const items = [
      { dish: { id: 1, name: 'Суп' }, day: 'sat' },
      { dish: { id: 4, name: 'Салат Мадика' }, day: 'sat' },
      { dish: { id: 5, name: 'Курица' }, day: null },
    ];
    const ing = new Map([
      [1, [{ product_id: 1, qty: 2, unit: 'шт' }, { product_id: 5, qty: 1, unit: 'шт' }]],
      [4, [{ product_id: 1, qty: 2, unit: 'шт' }]],
    ]);
    const text = menuText('14–15 ноября', items, ing, products, new Set([5]));
    expect(text).toBe([
      '🍽 Меню на 14–15 ноября', '',
      'СУББОТА',
      '🔸 *Суп*', '    ▫️ Копчёная грудка 2 шт', '    ▫️ Лимон 1 шт — есть дома 🏠',
      '🔸 *Салат Мадика*', '    ▫️ Копчёная грудка 2 шт', '',
      'В ЛЮБОЙ ДЕНЬ',
      '🔸 *Курица*', '    продукты не указаны',
    ].join('\n'));
  });
});
