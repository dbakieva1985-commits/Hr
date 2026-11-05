import { describe, expect, it } from 'vitest';
import { parseIngredient } from '../src/lib/parse.js';

describe('parseIngredient', () => {
  it.each([
    ['грудка копчёная 2 шт', { name: 'Грудка копчёная', qty: 2, unit: 'шт' }],
    ['лук 200г', { name: 'Лук', qty: 200, unit: 'г' }],
    ['молоко 0,5 л', { name: 'Молоко', qty: 0.5, unit: 'л' }],
    ['2 пачки сметаны', { name: 'Сметаны', qty: 2, unit: 'пачка' }],
    ['лимон 1', { name: 'Лимон', qty: 1, unit: 'шт' }],
    ['соль по вкусу', { name: 'Соль', qty: null, unit: 'по вкусу' }],
    ['маслины', { name: 'Маслины', qty: null, unit: 'шт' }],
    ['фарш 1,5 кг', { name: 'Фарш', qty: 1.5, unit: 'кг' }],
  ])('%s', (input, expected) => {
    expect(parseIngredient(input)).toEqual(expected);
  });

  it('empty input', () => expect(parseIngredient('  ')).toBeNull());
});

import { formatAmount } from '../src/lib/parse.js';
describe('formatAmount', () => {
  it('declines countable units', () => {
    expect(formatAmount(1, 'пачка')).toBe('1 пачка');
    expect(formatAmount(2, 'пачка')).toBe('2 пачки');
    expect(formatAmount(5, 'банка')).toBe('5 банок');
    expect(formatAmount(1.5, 'пакет')).toBe('1,5 пакета');
    expect(formatAmount(0.8, 'кг')).toBe('0,8 кг');
  });
});
