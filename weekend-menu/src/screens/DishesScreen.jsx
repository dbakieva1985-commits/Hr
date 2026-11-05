import { useMemo, useState } from 'react';
import { addDishToPlan, findOrCreateDish } from '../db.js';
import { useDishes, useIngredients, usePlanItems } from '../hooks.js';
import { CATEGORIES, LONG_AGO_DAYS } from '../lib/constants.js';
import { normalizeName } from '../lib/parse.js';
import { daysBetween } from '../lib/week.js';
import { Button, Chip, Empty, Header, inputCls } from '../components/ui.jsx';

export function DishesScreen({ planId, openDish }) {
  const dishes = useDishes();
  const ingredients = useIngredients();
  const items = usePlanItems(planId);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(null);

  const inPlan = useMemo(() => new Set(items.map((i) => i.dish_id)), [items]);
  const counts = useMemo(() => {
    const m = new Map();
    for (const i of ingredients) m.set(i.dish_id, (m.get(i.dish_id) ?? 0) + 1);
    return m;
  }, [ingredients]);

  const key = normalizeName(q);
  const list = dishes
    .filter((d) => (!key || d.key.includes(key)) && (!cat || d.category === cat))
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'));

  const create = async () => {
    const dish = await findOrCreateDish(q.trim() || 'Новое блюдо');
    setQ('');
    openDish(dish.id);
  };

  return (
    <>
      <Header title="Блюда" subtitle={`${dishes.length} в библиотеке`} />
      <div className="space-y-3 px-4 pt-3">
        <input className={inputCls} type="search" placeholder="Поиск блюда" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <Chip active={!cat} onClick={() => setCat(null)}>Все</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(cat === c ? null : c)}>{c}</Chip>
          ))}
        </div>
      </div>

      {list.length === 0 && <Empty>{dishes.length ? 'Ничего не нашлось' : 'Библиотека пуста — добавьте первое блюдо.'}</Empty>}

      <ul className="mt-2 divide-y divide-stone-200 dark:divide-stone-800">
        {list.map((d) => {
          const n = counts.get(d.id) ?? 0;
          const longAgo = d.last_cooked_at && daysBetween(d.last_cooked_at) >= LONG_AGO_DAYS;
          return (
            <li key={d.id} className="flex items-center gap-2 px-4">
              <button type="button" className="min-w-0 flex-1 py-3 text-left" onClick={() => openDish(d.id)}>
                <div className="truncate text-base">{d.name}</div>
                <div className="flex flex-wrap gap-x-2 text-xs text-stone-500 dark:text-stone-400">
                  {d.category && <span>{d.category}</span>}
                  <span className={n ? '' : 'text-amber-600 dark:text-amber-400'}>{n ? `${n} ингр.` : 'без ингредиентов'}</span>
                  {longAgo && <span className="text-sky-600 dark:text-sky-400">давно не готовила</span>}
                </div>
              </button>
              {inPlan.has(d.id) ? (
                <span className="px-2 text-sm text-emerald-600">в меню ✓</span>
              ) : (
                <Button variant="secondary" className="px-3 text-sm" onClick={() => addDishToPlan(planId, d.id)}>В меню</Button>
              )}
            </li>
          );
        })}
      </ul>

      <div className="sticky bottom-0 mt-4 bg-gradient-to-t from-stone-50 from-70% px-4 pt-4 pb-3 dark:from-stone-950">
        <Button className="w-full" onClick={create}>＋ {q.trim() ? `Создать «${q.trim()}»` : 'Новое блюдо'}</Button>
      </div>
    </>
  );
}
