import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useMemo, useState } from 'react';
import {
  addDishToPlan, addIngredient, db, deleteDish, removeIngredient, removePlanItem, updateDish, updateIngredient,
} from '../db.js';
import { toMap, useProducts, usePlanItems } from '../hooks.js';
import { CATEGORIES, TO_TASTE, UNITS } from '../lib/constants.js';
import { formatAmount, formatQty, parseIngredient } from '../lib/parse.js';
import { Button, Chip, IconButton, inputCls } from '../components/ui.jsx';

export function DishCard({ dishId, planId, onClose }) {
  const dish = useLiveQuery(async () => (await db.dishes.get(dishId)) ?? null, [dishId]);
  const ingredients = useLiveQuery(() => db.dishIngredients.where('dish_id').equals(dishId).toArray(), [dishId], []);
  const products = useProducts();
  const productMap = useMemo(() => toMap(products), [products]);
  const items = usePlanItems(planId);
  const planItem = items.find((i) => i.dish_id === dishId);

  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [line, setLine] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (dish) { setName(dish.name); setNote(dish.note ?? ''); }
  }, [dish?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (dish === null) onClose(); }, [dish, onClose]);

  if (!dish) return null;

  const parsed = parseIngredient(line);
  const submitIngredient = async (e) => {
    e.preventDefault();
    if (!parsed) return;
    await addIngredient(dish.id, parsed);
    setLine('');
  };

  const saveName = async () => {
    const n = name.trim();
    if (!n || n === dish.name) return setName(dish.name);
    try { await updateDish(dish.id, { name: n }); } catch { alert('Блюдо с таким названием уже есть'); setName(dish.name); }
  };

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto bg-stone-50 dark:bg-stone-950">
      <div className="mx-auto max-w-lg pb-[max(env(safe-area-inset-bottom),16px)]">
        <header className="sticky top-0 z-10 flex items-center gap-1 border-b border-stone-200 bg-stone-50/95 px-2 pt-[max(env(safe-area-inset-top),8px)] pb-2 backdrop-blur dark:border-stone-800 dark:bg-stone-950/95">
          <IconButton label="Назад" onClick={onClose} className="text-xl">←</IconButton>
          <input
            className="min-w-0 flex-1 rounded-lg bg-transparent px-2 py-1 text-xl font-semibold focus:bg-white focus:outline-none dark:focus:bg-stone-900"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            aria-label="Название блюда"
          />
        </header>

        <div className="space-y-5 px-4 pt-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Chip key={c} active={dish.category === c} onClick={() => updateDish(dish.id, { category: dish.category === c ? null : c })}>{c}</Chip>
            ))}
          </div>

          <section>
            <h2 className="mb-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">Ингредиенты</h2>
            {ingredients.length === 0 && <p className="mb-2 text-sm text-amber-600">Пока пусто — допишите, что нужно купить.</p>}
            <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 dark:divide-stone-800 dark:border-stone-800">
              {ingredients.map((ing) =>
                editId === ing.id ? (
                  <IngredientEditor key={ing.id} ing={ing} product={productMap.get(ing.product_id)} onDone={() => setEditId(null)} />
                ) : (
                  <li key={ing.id} className="flex items-center gap-2 pl-3">
                    <button type="button" className="min-w-0 flex-1 py-2.5 text-left" onClick={() => setEditId(ing.id)}>
                      {productMap.get(ing.product_id)?.name ?? '…'}
                      <span className="text-stone-500"> · {formatAmount(ing.qty, ing.unit) || '—'}</span>
                      {ing.note && <span className="block text-xs text-stone-500">{ing.note}</span>}
                    </button>
                    <IconButton label="Удалить ингредиент" onClick={() => removeIngredient(ing.id)}>✕</IconButton>
                  </li>
                ),
              )}
            </ul>
            <form onSubmit={submitIngredient} className="mt-2">
              <input
                className={inputCls}
                list="products-list"
                placeholder="+ Ингредиент: грудка копчёная 2 шт"
                value={line}
                onChange={(e) => setLine(e.target.value)}
                enterKeyHint="enter"
              />
              <datalist id="products-list">
                {products.map((p) => <option key={p.id} value={p.name} />)}
              </datalist>
              {parsed && (
                <div className="mt-1 flex items-center justify-between text-sm text-stone-500">
                  <span>{parsed.name} · {formatAmount(parsed.qty, parsed.unit) || 'без количества'}</span>
                  <Button type="submit" variant="ghost" className="min-h-8 text-emerald-700 dark:text-emerald-400">Добавить</Button>
                </div>
              )}
            </form>
          </section>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold tracking-wide text-stone-500 uppercase">Заметка</span>
            <textarea
              className={`${inputCls} min-h-20 py-2`}
              value={note}
              placeholder="Где брать, как готовить, на сколько порций…"
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => note !== (dish.note ?? '') && updateDish(dish.id, { note })}
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {planItem ? (
              <Button variant="secondary" className="flex-1" onClick={() => removePlanItem(planItem.id)}>Убрать из меню</Button>
            ) : (
              <Button className="flex-1" onClick={() => addDishToPlan(planId, dish.id)}>В меню выходных</Button>
            )}
            <Button
              variant="danger"
              onClick={async () => { if (confirm(`Удалить «${dish.name}» из библиотеки?`)) { await deleteDish(dish.id); onClose(); } }}
            >
              Удалить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IngredientEditor({ ing, product, onDone }) {
  const [qty, setQty] = useState(formatQty(ing.qty));
  const [unit, setUnit] = useState(ing.unit ?? 'шт');
  const [note, setNote] = useState(ing.note ?? '');
  const save = async (e) => {
    e.preventDefault();
    const n = Number(qty.replace(',', '.'));
    await updateIngredient(ing.id, {
      qty: unit === TO_TASTE || qty.trim() === '' || !Number.isFinite(n) ? null : n,
      unit,
      note: note.trim(),
    });
    onDone();
  };
  return (
    <li className="p-3">
      <form onSubmit={save} className="space-y-2">
        <div className="font-medium">{product?.name}</div>
        <div className="flex gap-2">
          <input className={`${inputCls} w-24`} inputMode="decimal" value={qty} disabled={unit === TO_TASTE} onChange={(e) => setQty(e.target.value)} aria-label="Количество" />
          <select className={inputCls} value={unit} onChange={(e) => setUnit(e.target.value)} aria-label="Единица">
            {UNITS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>
        <input className={inputCls} placeholder="Примечание (необязательно)" value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">Готово</Button>
          <Button variant="ghost" onClick={onDone}>Отмена</Button>
        </div>
      </form>
    </li>
  );
}
