import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import {
  addDishToPlan, db, getOrCreatePlan, moveItem, moveToPlan, removePlanItem, setCooked, setItemDay, toggleFavorite,
} from '../db.js';
import { weekendShort } from '../lib/week.js';
import { WeekendPicker } from './WeekendPicker.jsx';
import { Button, Sheet, useBackClose } from './ui.jsx';

const DAYS = [['sat', 'Суббота'], ['sun', 'Воскресенье'], [null, 'Не важно']];

/**
 * Everything you can do with a dish in one sheet.
 * With `itemId` it also manages that dish inside a weekend menu.
 */
export function DishActions({ dishId, itemId, onClose, openDish, onAdded }) {
  const dish = useLiveQuery(() => (dishId ? db.dishes.get(dishId) : undefined), [dishId]);
  const item = useLiveQuery(() => (itemId ? db.planItems.get(itemId) : undefined), [itemId]);
  const [picking, setPicking] = useState(null); // 'add' | 'move'
  const [done, setDone] = useState('');

  const close = () => { setDone(''); setPicking(null); onClose(); };
  // One Back layer for the whole sheet; the weekend picker stacks its own layer on top.
  useBackClose(!!dishId, close);

  if (!dishId || !dish) return null;

  const pick = async (sat) => {
    const planId = await getOrCreatePlan(sat);
    if (picking === 'move' && item) {
      await moveToPlan(item, planId);
      setPicking(null);
      close();
      return;
    }
    const added = await addDishToPlan(planId, dish.id);
    setPicking(null);
    setDone(added ? `Добавлено на ${weekendShort(sat)}` : `Уже есть в меню ${weekendShort(sat)}`);
    onAdded?.(sat);
  };

  return (
    <>
      <Sheet open={!picking} onClose={close} title={dish.name} backLayer={false}>
        <div className="space-y-4">
          {item && (
            <>
              <div className="grid grid-cols-3 gap-1 rounded-xl bg-stone-100 p-1 dark:bg-stone-800">
                {DAYS.map(([day, label]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setItemDay(item.id, day)}
                    className={`min-h-11 rounded-lg text-sm ${item.day === day ? 'bg-white font-semibold shadow dark:bg-stone-950' : 'text-stone-600 dark:text-stone-300'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label className="flex min-h-11 items-center gap-3">
                <input type="checkbox" className="size-5 accent-emerald-600" checked={!!item.cooked} onChange={(e) => setCooked(item, e.target.checked)} />
                Приготовлено
              </label>
            </>
          )}

          <div className="grid gap-2">
            <Button variant="secondary" onClick={() => toggleFavorite(dish.id)}>
              {dish.favorite ? '★ В любимых — убрать' : '☆ Добавить в любимые'}
            </Button>
            {item ? (
              <Button variant="secondary" onClick={() => setPicking('move')}>Перенести на другие выходные</Button>
            ) : (
              <Button variant="secondary" onClick={() => setPicking('add')}>Добавить на выходные…</Button>
            )}
            {item && <Button variant="secondary" onClick={() => setPicking('add')}>Ещё и на другие выходные…</Button>}
            <Button variant="secondary" onClick={() => { close(); openDish(dish.id); }}>✎ Изменить блюдо: название, ингредиенты</Button>
            {item && (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="ghost" onClick={() => moveItem(item.plan_id, item.id, -1)}>▲ Выше</Button>
                <Button variant="ghost" onClick={() => moveItem(item.plan_id, item.id, 1)}>▼ Ниже</Button>
              </div>
            )}
            {item && <Button variant="danger" onClick={async () => { await removePlanItem(item.id); close(); }}>Убрать из меню</Button>}
          </div>
          {done && <p className="text-center text-sm text-emerald-700 dark:text-emerald-400">{done}</p>}
        </div>
      </Sheet>
      <WeekendPicker
        open={!!picking}
        onClose={() => setPicking(null)}
        onPick={pick}
        title={picking === 'move' ? 'Перенести на…' : `«${dish.name}» на выходные…`}
        excludeSat={undefined}
      />
    </>
  );
}
