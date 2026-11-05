import { UNITS, TO_TASTE } from './constants.js';

// Synonyms → canonical unit.
const UNIT_ALIASES = {
  'шт': 'шт', 'шт.': 'шт', 'штук': 'шт', 'штуки': 'шт', 'штука': 'шт',
  'кг': 'кг', 'кг.': 'кг', 'килограмм': 'кг',
  'г': 'г', 'г.': 'г', 'гр': 'г', 'гр.': 'г', 'грамм': 'г', 'грамма': 'г', 'граммов': 'г',
  'л': 'л', 'л.': 'л', 'литр': 'л', 'литра': 'л',
  'мл': 'мл', 'мл.': 'мл',
  'пачка': 'пачка', 'пачки': 'пачка', 'пачек': 'пачка', 'пач': 'пачка', 'уп': 'пачка', 'упаковка': 'пачка',
  'пакет': 'пакет', 'пакета': 'пакет', 'пакетов': 'пакет', 'пак': 'пакет',
  'банка': 'банка', 'банки': 'банка', 'банок': 'банка', 'бан': 'банка',
};

export function normalizeUnit(u) {
  if (!u) return null;
  const key = u.trim().toLowerCase();
  if (key === TO_TASTE) return TO_TASTE;
  return UNIT_ALIASES[key] ?? (UNITS.includes(key) ? key : null);
}

export function normalizeName(name) {
  return name.trim().replace(/\s+/g, ' ').toLowerCase().replace(/ё/g, 'е');
}

export function capitalize(s) {
  const t = s.trim().replace(/\s+/g, ' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function parseNumber(s) {
  if (/^\d+\/\d+$/.test(s)) {
    const [a, b] = s.split('/').map(Number);
    return b ? a / b : null;
  }
  const n = Number(s.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

/**
 * One-line ingredient input: «грудка копчёная 2 шт» → { name, qty: 2, unit: 'шт' }.
 * Supports «соль по вкусу», «лук 200г», «2 шт яйца», bare «лимон» (→ 1 шт? no: qty null, unit шт).
 */
export function parseIngredient(input) {
  let text = input.trim().replace(/\s+/g, ' ');
  if (!text) return null;

  if (/\s*по вкусу$/i.test(text)) {
    const name = text.replace(/\s*по вкусу$/i, '').trim();
    return name ? { name: capitalize(name), qty: null, unit: TO_TASTE } : null;
  }

  // Split glued number+unit: «200г» → «200 г»
  text = text.replace(/(\d)([a-zа-яё]+\.?)(?=\s|$)/gi, '$1 $2');
  const tokens = text.split(' ');

  const tryTail = () => {
    // … <qty> <unit>  |  … <qty>
    const last = tokens[tokens.length - 1];
    const prev = tokens[tokens.length - 2];
    const unit = normalizeUnit(last);
    if (unit && prev != null && parseNumber(prev) != null && tokens.length > 2) {
      return { name: tokens.slice(0, -2).join(' '), qty: parseNumber(prev), unit };
    }
    if (parseNumber(last) != null && tokens.length > 1) {
      return { name: tokens.slice(0, -1).join(' '), qty: parseNumber(last), unit: 'шт' };
    }
    return null;
  };
  const tryHead = () => {
    // <qty> <unit> …  |  <qty> …
    const q = parseNumber(tokens[0]);
    if (q == null) return null;
    const unit = normalizeUnit(tokens[1] ?? '');
    if (unit && tokens.length > 2) return { name: tokens.slice(2).join(' '), qty: q, unit };
    if (tokens.length > 1) return { name: tokens.slice(1).join(' '), qty: q, unit: 'шт' };
    return null;
  };

  const r = tryTail() ?? tryHead() ?? { name: text, qty: null, unit: 'шт' };
  return { ...r, name: capitalize(r.name) };
}

export function formatQty(qty) {
  if (qty == null) return '';
  return String(Math.round(qty * 1000) / 1000).replace('.', ',');
}

// Countable units that change their ending: 1 пачка, 2 пачки, 5 пачек.
const UNIT_FORMS = {
  'пачка': ['пачка', 'пачки', 'пачек'],
  'пакет': ['пакет', 'пакета', 'пакетов'],
  'банка': ['банка', 'банки', 'банок'],
};

function unitFor(qty, unit) {
  const forms = UNIT_FORMS[unit];
  if (!forms || qty == null) return unit;
  if (!Number.isInteger(qty)) return forms[1]; // 1,5 пачки
  const m10 = qty % 10, m100 = qty % 100;
  if (m10 === 1 && m100 !== 11) return forms[0];
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return forms[1];
  return forms[2];
}

export function formatAmount(qty, unit) {
  if (unit === TO_TASTE) return TO_TASTE;
  if (qty == null) return unit && unit !== 'шт' ? unit : '';
  return `${formatQty(qty)} ${unitFor(qty, unit)}`;
}
