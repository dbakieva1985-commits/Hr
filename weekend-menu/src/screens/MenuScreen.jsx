import { useMemo, useState } from 'react';
import { moveItem, removePlanItem, setCooked, setItemDay } from '../db.js';
import { toMap, useDishes, useIngredients, usePlan, usePlanItems } from '../hooks.js';
import { weekendTitle } from '../lib/week.js';
import { QuickAdd } from '../components/QuickAdd.jsx';
import { Button, Chip, Empty, Header, IconButton } from '../components/ui.jsx';

const SECTIONS = [
  { day: 'sat', title: 'Суббота' },
  { day: 'sun', title: 'Воскресенье' },
  { day: null, title: 'Не назначено' },
];

function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
export { plural };

export function MenuScreen({ planId, openDish, goShopping }) {
  const plan = usePlan(planId);
  const items = usePlanItems(planId);
  const dishes = useDishes();
  const ingredients = useIngredients();
  const [adding, setAdding] = useState(false);

  const dishMap = useMemo(() => toMap(dishes), [dishes]);
  const withIngredients = useMemo(() => new Set(ingredients.map((i) => i.dish_id)), [ingredients]);
  const inPlan = useMemo(() => new Set(items.map((i) => i.dish_id)), [items]);
  const emptyCount = items.filter((i) => !withIngredients.has(i.dish_id)).length;

  return (
    <>
      <Header
        title={plan ? weekendTitle(plan.sat_date) : 'Выходные'}
        subtitle={items.length ? `${items.length} ${plural(items.length, 'блюдо', 'блюда', 'блюд')}` : 'Меню пока пустое'}
      />

      {emptyCount > 0 && (
        <div className="mx-4 mt-3 rounded-xl bg-amber-100 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {emptyCount} {plural(emptyCount, 'блюдо', 'блюда', 'блюд')} без ингредиентов — откройте и допишите
        </div>
      )}

      {items.length === 0 && (
        <Empty>
          В будни добавляйте сюда идеи — к выходным меню уже будет наполовину готово.
        </Empty>
      )}

      {SECTIONS.map(({ day, title }) => {
        const list = items.filter((i) => i.day === day);
        if (list.length === 0 && (day === null || items.length === 0)) return null;
        return (
          <section key={title} className="mt-4">
            <h2 className="px-4 pb-1 text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">
              {title}
            </h2>
            {list.length === 0 && <div className="px-4 py-2 text-sm text-stone-400">—</div>}
            <ul className="divide-y divide-stone-200 dark:divide-stone-800">
              {list.map((item, idx) => {
                const dish = dishMap.get(item.dish_id);
                if (!dish) return null;
                const noIngr = !withIngredients.has(dish.id);
                return (
                  <li key={item.id} className="flex items-center gap-1 py-1 pr-1 pl-2">
                    <label className="flex size-11 shrink-0 items-center justify-center" title="Приготовлено">
                      <input
                        type="checkbox"
                        className="size-5 accent-emerald-600"
                        checked={!!item.cooked}
                        onChange={(e) => setCooked(item, e.target.checked)}
                        aria-label={`${dish.name}: приготовлено`}
                      />
                    </label>
                    <button type="button" className="min-w-0 flex-1 py-2 text-left" onClick={() => openDish(dish.id)}>
                      <div className={`truncate text-base ${item.cooked ? 'text-stone-400 line-through' : ''}`}>{dish.name}</div>
                      {noIngr && <div className="text-xs text-amber-600 dark:text-amber-400">ингредиенты не заполнены</div>}
                    </button>
                    <div className="flex gap-1">
                      <Chip active={item.day === 'sat'} onClick={() => setItemDay(item.id, item.day === 'sat' ? null : 'sat')}>Сб</Chip>
                      <Chip active={item.day === 'sun'} onClick={() => setItemDay(item.id, item.day === 'sun' ? null : 'sun')}>Вс</Chip>
                    </div>
                    <div className="flex flex-col">
                      <IconButton label="Выше" className="h-5" disabled={idx === 0} onClick={() => moveItem(planId, item.id, -1)}>▲</IconButton>
                      <IconButton label="Ниже" className="h-5" disabled={idx === list.length - 1} onClick={() => moveItem(planId, item.id, 1)}>▼</IconButton>
                    </div>
                    <IconButton label="Убрать из меню" onClick={() => removePlanItem(item.id)}>✕</IconButton>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <div className="sticky bottom-0 mt-6 flex gap-2 bg-gradient-to-t from-stone-50 from-70% px-4 pt-4 pb-3 dark:from-stone-950">
        <Button variant="secondary" className="flex-1" onClick={() => setAdding(true)}>＋ Блюдо</Button>
        <Button className="flex-1" disabled={items.length === 0} onClick={goShopping}>Собрать список</Button>
      </div>

      <QuickAdd open={adding} onClose={() => setAdding(false)} planId={planId} dishes={dishes} inPlan={inPlan} />
    </>
  );
}
