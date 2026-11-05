import { formatAmount } from './parse.js';

const DAY_TITLES = [['sat', 'СУББОТА'], ['sun', 'ВОСКРЕСЕНЬЕ'], [null, null]];

/**
 * Menu for WhatsApp: every dish with the products it needs, so it is clear what each product is for.
 * @param {string} title  e.g. «14–15 ноября»
 * @param {Array} items   plan items (ordered) with { dish, day }
 * @param {Map} ingByDish dish_id → DishIngredient[]
 * @param {Map} products  id → Product
 * @param {Set} atHome    product ids marked «есть дома» for this weekend
 */
export function menuText(title, items, ingByDish, products, atHome = new Set()) {
  const out = [`🍽 Меню на ${title}`];
  const anyDay = items.some((i) => i.day);
  for (const [day, dayTitle] of DAY_TITLES) {
    const list = items.filter((i) => i.day === day);
    if (!list.length) continue;
    out.push('');
    if (anyDay) out.push(dayTitle ?? 'В ЛЮБОЙ ДЕНЬ');
    for (const { dish } of list) {
      out.push(`🔸 *${dish.name}*`);
      const ings = ingByDish.get(dish.id) ?? [];
      if (!ings.length) out.push('    продукты не указаны');
      for (const ing of ings) {
        const name = products.get(ing.product_id)?.name ?? '?';
        const amount = formatAmount(ing.qty, ing.unit);
        const home = atHome.has(ing.product_id) ? ' — есть дома 🏠' : '';
        out.push(`    ▫️ ${name}${amount ? ` ${amount}` : ''}${home}`);
      }
    }
  }
  if (items.length === 0) out.push('', 'Пока ничего не запланировано');
  return out.join('\n');
}
