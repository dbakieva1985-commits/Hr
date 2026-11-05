import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  addDishToPlan, db, getOrCreatePlan, patchProductLine, previousPlanWithItems, removePlanItem, repeatWeek, setCooked, setItemDay,
} from '../db.js';
import { toMap, useDishes, useIngredients, usePlanItems, usePlansIndex, useProducts } from '../hooks.js';
import { formatAmount } from '../lib/parse.js';
import { addWeeks, nearestSaturday, relativeLabel, weekendShort, weekendStatus, weekendTitle } from '../lib/week.js';
import { DishActions } from '../components/DishActions.jsx';
import { ShareButton } from '../components/ShareButton.jsx';
import { menuText } from '../lib/menuText.js';
import { QuickAdd } from '../components/QuickAdd.jsx';
import { WeekendPicker } from '../components/WeekendPicker.jsx';
import { Button, Chip, Empty, IconButton } from '../components/ui.jsx';

const SECTIONS = [
  { day: 'sat', title: 'Суббота' },
  { day: 'sun', title: 'Воскресенье' },
  { day: null, title: 'Не назначено' },
];

export function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

const AHEAD = 8;
const BEHIND = 6;

/** Horizontal strip of weekends: a few past ones that had a menu, this one, and the next two months. */
function WeekStrip({ sat, setSat, index }) {
  const cur = nearestSaturday();
  const weeks = useMemo(() => {
    const past = [];
    for (let i = BEHIND; i >= 1; i--) {
      const s = addWeeks(cur, -i);
      if (index.get(s)?.count) past.push(s);
    }
    const next = Array.from({ length: AHEAD + 1 }, (_, i) => addWeeks(cur, i));
    const all = [...past, ...next];
    if (!all.includes(sat)) all.push(sat);
    return all.sort();
  }, [cur, index, sat]);

  const selRef = useRef(null);
  useEffect(() => { selRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' }); }, [sat]);

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none]">
      {weeks.map((s) => {
        const count = index.get(s)?.count ?? 0;
        const selected = s === sat;
        const past = weekendStatus(s) === 'past';
        return (
          <button
            key={s}
            ref={selected ? selRef : null}
            type="button"
            onClick={() => setSat(s)}
            aria-pressed={selected}
            className={`flex min-w-[5.5rem] shrink-0 flex-col items-start rounded-xl border px-3 py-1.5 text-left ${
              selected
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : past
                  ? 'border-stone-200 text-stone-400 dark:border-stone-800'
                  : 'border-stone-300 dark:border-stone-700'
            }`}
          >
            <span className="text-sm font-medium whitespace-nowrap">{weekendShort(s)}</span>
            <span className={`text-xs whitespace-nowrap ${selected ? 'text-emerald-50' : 'text-stone-500'}`}>
              {s === cur ? 'сейчас' : count ? `${count} ${plural(count, 'блюдо', 'блюда', 'блюд')}` : past ? 'прошли' : '—'}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FavoritesRow({ dishes, inPlan, planId }) {
  const favs = dishes.filter((d) => d.favorite).sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  if (favs.length === 0) {
    return (
      <p className="mx-4 mt-3 rounded-xl bg-stone-100 px-3 py-2 text-sm text-stone-600 dark:bg-stone-900 dark:text-stone-400">
        ☆ Любимые блюда появятся здесь — отметьте звёздочкой в «Блюдах».
      </p>
    );
  }
  return (
    <section className="mt-3">
      <h2 className="px-4 pb-1 text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">★ Любимые — нажмите, чтобы добавить</h2>
      <div className="flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {favs.map((d) => {
          const added = inPlan.has(d.id);
          return (
            <Chip
              key={d.id}
              active={added}
              className="min-h-10"
              onClick={() => !added && addDishToPlan(planId, d.id)}
              aria-label={added ? `${d.name}: уже в меню` : `Добавить ${d.name}`}
            >
              {added ? '✓ ' : '+ '}{d.name}
            </Chip>
          );
        })}
      </div>
    </section>
  );
}

export function MenuScreen({ sat, setSat, planId, openDish, goShopping }) {
  const items = usePlanItems(planId);
  const dishes = useDishes();
  const ingredients = useIngredients();
  const products = useProducts();
  const productMap = useMemo(() => toMap(products), [products]);
  const atHome = useLiveQuery(
    async () => new Set(
      (await db.shoppingOverrides.where('plan_id').equals(planId).toArray())
        .filter((o) => !o.is_manual && o.have_at_home).map((o) => o.product_id),
    ),
    [planId],
    new Set(),
  );
  const ingByDish = useMemo(() => {
    const m = new Map();
    for (const i of ingredients) {
      if (!m.has(i.dish_id)) m.set(i.dish_id, []);
      m.get(i.dish_id).push(i);
    }
    return m;
  }, [ingredients]);
  const index = usePlansIndex();
  const [adding, setAdding] = useState(false);
  const [action, setAction] = useState(null); // { dishId, itemId }
  const [repeating, setRepeating] = useState(false);
  const [prevPlan, setPrevPlan] = useState(null);
  const [removed, setRemoved] = useState(null); // { item, name } for «Вернуть»

  useEffect(() => {
    if (!removed) return;
    const t = setTimeout(() => setRemoved(null), 6000);
    return () => clearTimeout(t);
  }, [removed]);

  const remove = async (item, name) => {
    await removePlanItem(item.id);
    setRemoved({ item, name });
  };
  const undoRemove = async () => {
    await db.planItems.put(removed.item);
    setRemoved(null);
  };

  const dishMap = useMemo(() => toMap(dishes), [dishes]);
  const withIngredients = useMemo(() => new Set(ingredients.map((i) => i.dish_id)), [ingredients]);
  const inPlan = useMemo(() => new Set(items.map((i) => i.dish_id)), [items]);
  const emptyCount = items.filter((i) => !withIngredients.has(i.dish_id)).length;
  const status = weekendStatus(sat);

  useEffect(() => {
    if (items.length === 0) previousPlanWithItems(sat).then(setPrevPlan);
  }, [sat, items.length]);

  const repeatTo = async (target) => {
    const to = await getOrCreatePlan(target);
    await repeatWeek(planId, to);
    setRepeating(false);
    setSat(target);
  };

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-stone-50/95 pt-[max(env(safe-area-inset-top),8px)] backdrop-blur dark:border-stone-800 dark:bg-stone-950/95">
        <WeekStrip sat={sat} setSat={setSat} index={index} />
        <div className="flex items-baseline gap-2 px-4 pb-2">
          <h1 className="min-w-0 flex-1 truncate text-xl font-semibold">{weekendTitle(sat).replace('Выходные ', '')}</h1>
          <span className="shrink-0 text-sm text-stone-500">{relativeLabel(sat)}</span>
        </div>
      </header>

      {status === 'past' && (
        <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl bg-stone-100 px-3 py-2 text-sm dark:bg-stone-900">
          <span className="flex-1 text-stone-600 dark:text-stone-400">Эти выходные прошли.</span>
          {items.length > 0 && <Button variant="primary" className="min-h-9 text-sm" onClick={() => setRepeating(true)}>Повторить меню</Button>}
        </div>
      )}

      {status !== 'past' && <FavoritesRow dishes={dishes} inPlan={inPlan} planId={planId} />}

      {emptyCount > 0 && (
        <div className="mx-4 mt-3 rounded-xl bg-amber-100 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {emptyCount} {plural(emptyCount, 'блюдо', 'блюда', 'блюд')} без ингредиентов — нажмите ✎, чтобы дописать
        </div>
      )}

      {items.length > 0 && (
        <div className="mx-4 mt-3">
          <ShareButton
            label="📤 Отправить меню с продуктами"
            getText={() => menuText(
              weekendTitle(sat).replace('Выходные ', ''),
              items.map((i) => ({ ...i, dish: dishMap.get(i.dish_id) })).filter((i) => i.dish),
              ingByDish, productMap, atHome,
            )}
          />
        </div>
      )}

      {items.some((i) => ingByDish.has(i.dish_id)) && (
        <p className="mx-4 mt-3 text-sm text-stone-500 dark:text-stone-400">
          Под блюдом — что купить. Есть дома? Нажмите на продукт 🏠
        </p>
      )}

      {items.length === 0 && (
        <Empty>
          <p>На эти выходные пока ничего нет.</p>
          {prevPlan && status !== 'past' && (
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => repeatWeek(prevPlan.id, planId)}
            >
              Как {weekendShort(prevPlan.sat_date)}
            </Button>
          )}
        </Empty>
      )}

      {SECTIONS.map(({ day, title }) => {
        const list = items.filter((i) => i.day === day);
        const anyDay = items.some((i) => i.day);
        if (list.length === 0 && (day === null || !anyDay)) return null; // no empty day blocks until days are used
        return (
          <section key={title} className="mt-4">
            {anyDay && <h2 className="px-4 pb-1 text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">{title}</h2>}
            {list.length === 0 && <div className="px-4 py-2 text-sm text-stone-400">—</div>}
            <ul className="divide-y divide-stone-200 dark:divide-stone-800">
              {list.map((item) => {
                const dish = dishMap.get(item.dish_id);
                if (!dish) return null;
                const noIngr = !withIngredients.has(dish.id);
                return (
                  <li key={item.id} className="py-2 pr-1 pl-2">
                    <div className="flex items-start gap-1">
                      <label className="flex size-11 shrink-0 items-center justify-center" title="Приготовлено">
                        <input
                          type="checkbox"
                          className="size-5 accent-emerald-600"
                          checked={!!item.cooked}
                          onChange={(e) => setCooked(item, e.target.checked)}
                          aria-label={`${dish.name}: приготовлено`}
                        />
                      </label>
                      <button type="button" className="min-w-0 flex-1 pt-2.5 text-left" onClick={() => setAction({ dishId: dish.id, itemId: item.id })}>
                        <span className={`block text-base leading-snug ${item.cooked ? 'text-stone-400 line-through' : ''}`}>
                          {dish.favorite ? <span className="text-amber-500">★ </span> : null}
                          {dish.name}
                        </span>
                        {noIngr && <span className="block text-xs text-amber-600 dark:text-amber-400">ингредиенты не заполнены — нажмите ✎</span>}
                      </button>
                      <IconButton label={`Изменить ${dish.name}`} className="text-lg" onClick={() => openDish(dish.id)}>✎</IconButton>
                      <IconButton label={`Убрать ${dish.name} из меню`} onClick={() => remove(item, dish.name)}>✕</IconButton>
                    </div>
                    <div className="pr-3 pl-12">
                      {!noIngr && (
                        <ul className="mt-1 flex flex-wrap gap-1" aria-label={`Что купить для «${dish.name}»`}>
                          {(ingByDish.get(dish.id) ?? []).map((ing) => {
                            const home = atHome.has(ing.product_id);
                            const amount = formatAmount(ing.qty, ing.unit);
                            const name = productMap.get(ing.product_id)?.name ?? '…';
                            return (
                              <li key={ing.id}>
                                <button
                                  type="button"
                                  onClick={() => patchProductLine(planId, ing.product_id, { have_at_home: home ? 0 : 1, bought: 0 })}
                                  aria-pressed={home}
                                  title={home ? 'Есть дома — нажмите, чтобы купить' : 'Нажмите, если есть дома'}
                                  className={`min-h-7 rounded-full px-2 py-0.5 text-left text-[13px] leading-tight ${
                                    home
                                      ? 'bg-transparent text-stone-400 line-through ring-1 ring-stone-200 dark:ring-stone-800'
                                      : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200'
                                  }`}
                                >
                                  {home && <span className="no-underline">🏠 </span>}
                                  {name}{amount && <span className="text-stone-500 dark:text-stone-400"> {amount}</span>}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      <div className="mt-2 flex items-center gap-1.5">
                        <Chip active={item.day === 'sat'} onClick={() => setItemDay(item.id, item.day === 'sat' ? null : 'sat')}>Сб</Chip>
                        <Chip active={item.day === 'sun'} onClick={() => setItemDay(item.id, item.day === 'sun' ? null : 'sun')}>Вс</Chip>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <div className="sticky bottom-16 mt-6 flex gap-2 bg-gradient-to-t from-stone-50 from-70% px-4 pt-4 pb-3 dark:from-stone-950">
        <Button variant="secondary" className="flex-1 whitespace-nowrap px-3" onClick={() => setAdding(true)}>＋ Блюдо</Button>
        <Button className="flex-1 whitespace-nowrap px-3" disabled={items.length === 0} onClick={goShopping}>Собрать список</Button>
      </div>

      {removed && (
        <div role="status" className="fixed inset-x-0 bottom-20 z-30 mx-auto flex max-w-lg items-center gap-3 px-4">
          <div className="flex flex-1 items-center gap-3 rounded-xl bg-stone-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-stone-100 dark:text-stone-900">
            <span className="min-w-0 flex-1 truncate">«{removed.name}» убрано из меню</span>
            <button type="button" className="min-h-9 font-semibold text-emerald-300 dark:text-emerald-700" onClick={undoRemove}>Вернуть</button>
          </div>
        </div>
      )}

      <QuickAdd open={adding} onClose={() => setAdding(false)} planId={planId} dishes={dishes} inPlan={inPlan} />
      <DishActions dishId={action?.dishId} itemId={action?.itemId} onClose={() => setAction(null)} openDish={openDish} />
      <WeekendPicker open={repeating} onClose={() => setRepeating(false)} onPick={repeatTo} title="Повторить это меню на…" />
    </>
  );
}
