import { AISLES, DEFAULT_AISLE, TO_TASTE } from './constants.js';
import { formatAmount } from './parse.js';

/** Combine amounts of one product: same unit is summed, different units are joined («2 шт + 200 г»). */
export function combineAmounts(amounts) {
  const byUnit = new Map();
  let toTaste = false;
  for (const { qty, unit } of amounts) {
    if (unit === TO_TASTE) { toTaste = true; continue; }
    const cur = byUnit.get(unit) ?? { qty: null, unit };
    if (qty != null) cur.qty = (cur.qty ?? 0) + qty;
    byUnit.set(unit, cur);
  }
  const parts = [...byUnit.values()];
  const text = parts.map((p) => formatAmount(p.qty, p.unit)).filter(Boolean);
  if (toTaste) text.push(TO_TASTE);
  return text.join(' + ');
}

/**
 * F5: derive the shopping list from the menu. Only manual edits (overrides) are stored.
 *
 * @param {object} p
 * @param {Array} p.planItems     PlanItem[] of the active plan
 * @param {Map}   p.dishes        id → Dish
 * @param {Array} p.ingredients   DishIngredient[] (any dishes)
 * @param {Map}   p.products      id → Product
 * @param {Array} p.overrides     ShoppingOverride[] of the plan
 */
export function buildShoppingList({ planItems, dishes, ingredients, products, overrides = [] }) {
  const ingByDish = new Map();
  for (const ing of ingredients) {
    if (!ingByDish.has(ing.dish_id)) ingByDish.set(ing.dish_id, []);
    ingByDish.get(ing.dish_id).push(ing);
  }

  const missing = [];
  const byProduct = new Map(); // product_id → { amounts, sources }

  for (const item of planItems) {
    const dish = dishes.get(item.dish_id);
    if (!dish) continue;
    const ings = ingByDish.get(dish.id) ?? [];
    if (ings.length === 0) {
      missing.push({ dishId: dish.id, name: dish.name });
      continue;
    }
    for (const ing of ings) {
      const entry = byProduct.get(ing.product_id) ?? { amounts: [], sources: [] };
      entry.amounts.push({ qty: ing.qty, unit: ing.unit });
      entry.sources.push({ dish: dish.name, qty: ing.qty, unit: ing.unit });
      byProduct.set(ing.product_id, entry);
    }
  }

  const overrideByProduct = new Map();
  for (const o of overrides) if (!o.is_manual && o.product_id != null) overrideByProduct.set(o.product_id, o);

  const lines = [];
  for (const [productId, { amounts, sources }] of byProduct) {
    const product = products.get(productId);
    if (!product) continue;
    const o = overrideByProduct.get(productId);
    const computed = combineAmounts(amounts);
    lines.push({
      key: `p${productId}`,
      productId,
      name: product.name,
      aisle: product.aisle ?? DEFAULT_AISLE,
      computedAmount: computed,
      amount: o?.qty_override ?? computed,
      sources: mergeSources(sources, singleUnit(amounts)),
      override: o ?? null,
      bought: !!o?.bought,
      haveAtHome: !!o?.have_at_home,
      isManual: false,
    });
  }

  for (const o of overrides) {
    if (!o.is_manual) continue;
    const product = o.product_id != null ? products.get(o.product_id) : null;
    lines.push({
      key: `m${o.id}`,
      productId: o.product_id ?? null,
      name: product?.name ?? o.free_text,
      aisle: product?.aisle ?? o.aisle ?? DEFAULT_AISLE,
      computedAmount: '',
      amount: o.qty_override ?? '',
      sources: [],
      override: o,
      bought: !!o.bought,
      haveAtHome: !!o.have_at_home,
      isManual: true,
    });
  }

  lines.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  return { missing, lines };
}

/** «Суп 2, Салат 2» — one entry per dish, amounts within a dish combined. */
function mergeSources(sources, dropUnit) {
  const byDish = new Map();
  for (const s of sources) {
    if (!byDish.has(s.dish)) byDish.set(s.dish, []);
    byDish.get(s.dish).push(s);
  }
  return [...byDish].map(([dish, list]) => {
    let amount = combineAmounts(list);
    if (dropUnit && amount.endsWith(` ${dropUnit}`)) amount = amount.slice(0, -dropUnit.length - 1);
    return { dish, amount };
  });
}

/** The unit if every amount uses the same counted unit (then «Суп 2, Салат 2» reads cleaner). */
function singleUnit(amounts) {
  const units = new Set(amounts.map((a) => a.unit));
  const [u] = units;
  return units.size === 1 && u !== TO_TASTE ? u : null;
}

export function sourcesText(sources) {
  return sources.map((s) => (s.amount ? `${s.dish} ${s.amount}` : s.dish)).join(', ');
}

/** Group lines by aisle in the canonical aisle order. */
export function groupByAisle(lines) {
  const groups = new Map(AISLES.map((a) => [a, []]));
  for (const l of lines) {
    if (!groups.has(l.aisle)) groups.set(l.aisle, []);
    groups.get(l.aisle).push(l);
  }
  return [...groups].filter(([, ls]) => ls.length > 0).map(([aisle, ls]) => ({ aisle, lines: ls }));
}

/** Plain-text list for WhatsApp / Telegram: what is still to buy, by aisle. */
export function shoppingText(title, lines) {
  const toBuy = lines.filter((l) => !l.haveAtHome && !l.bought);
  const bought = lines.filter((l) => !l.haveAtHome && l.bought);
  const out = [`🛒 ${title}`];
  for (const { aisle, lines: ls } of groupByAisle(toBuy)) {
    out.push('', aisle.toUpperCase());
    for (const l of ls) {
      // One dish: «(для: Борщ)»; several: «(для: Суп 2, Салат 2)» so the split is visible.
      const why = l.sources.length === 1 ? ` (для: ${l.sources[0].dish})` : l.sources.length ? ` (для: ${sourcesText(l.sources)})` : '';
      out.push(`▫️ ${l.name}${l.amount ? ` — ${l.amount}` : ''}${why}`);
    }
  }
  if (toBuy.length === 0) out.push('', 'Всё куплено ✅');
  if (bought.length) out.push('', `Уже куплено: ${bought.map((l) => l.name).join(', ')}`);
  return out.join('\n');
}
