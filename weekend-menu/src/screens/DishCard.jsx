import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useMemo, useState } from 'react';
import {
  addDishToPlan, addIngredient, db, deleteDish, getOrCreatePlan, removeIngredient, removePlanItem, toggleFavorite, updateDish, updateIngredient,
} from '../db.js';
import { WeekendPicker } from '../components/WeekendPicker.jsx';
import { weekendShort } from '../lib/week.js';
import { toMap, useProducts, usePlanItems } from '../hooks.js';
import { AISLES, CATEGORIES, TO_TASTE, UNITS } from '../lib/constants.js';
import { formatAmount, formatQty, parseIngredient } from '../lib/parse.js';
import { Button, Chip, IconButton, inputCls } from '../components/ui.jsx';

const labelCls = 'mb-1.5 block text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400';

/** Dish editor: name, category, ingredients, note. Every change is saved right away. */
export function DishCard({ dishId, planId, sat, onClose }) {
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
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    if (dish) { setName(dish.name); setNote(dish.note ?? ''); }
  }, [dish?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (dish === null) onClose(); }, [dish, onClose]);
  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(''), 2000);
    return () => clearTimeout(t);
  }, [saved]);

  if (!dish) return null;

  const flash = (msg = 'Сохранено ✓') => setSaved(msg);
  const parsed = parseIngredient(line);

  const saveName = async () => {
    const n = name.trim();
    setError('');
    if (!n) { setName(dish.name); return true; }
    if (n === dish.name) return true;
    try {
      await updateDish(dish.id, { name: n });
      flash();
      return true;
    } catch {
      setError(`Блюдо «${n}» уже есть в библиотеке — выберите другое название`);
      return false;
    }
  };
  const saveNote = async () => {
    if (note !== (dish.note ?? '')) { await updateDish(dish.id, { note }); flash(); }
  };
  const saveAndClose = async () => {
    if (!(await saveName())) return;
    await saveNote();
    if (parsed) await addIngredient(dish.id, parsed);
    onClose();
  };

  const submitIngredient = async (e) => {
    e.preventDefault();
    if (!parsed) return;
    await addIngredient(dish.id, parsed);
    setLine('');
    flash('Ингредиент добавлен ✓');
  };

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto bg-stone-50 dark:bg-stone-950">
      <div className="mx-auto max-w-lg pb-28">
        <header className="sticky top-0 z-10 flex items-center gap-1 border-b border-stone-200 bg-stone-50/95 px-2 pt-[max(env(safe-area-inset-top),8px)] pb-2 backdrop-blur dark:border-stone-800 dark:bg-stone-950/95">
          <IconButton label="Назад" onClick={saveAndClose} className="text-xl">←</IconButton>
          <h1 className="min-w-0 flex-1 truncate px-1 text-lg font-semibold">Изменить блюдо</h1>
          <span aria-live="polite" className="text-xs text-emerald-700 dark:text-emerald-400">{saved}</span>
          <IconButton
            label={dish.favorite ? 'Убрать из любимых' : 'В любимые'}
            className={`text-2xl ${dish.favorite ? 'text-amber-500' : ''}`}
            onClick={() => toggleFavorite(dish.id)}
          >
            {dish.favorite ? '★' : '☆'}
          </IconButton>
        </header>

        <div className="space-y-6 px-4 pt-4">
          <label className="block" htmlFor="dish-name">
            <span className={labelCls}>Название</span>
            <input
              id="dish-name"
              className={`${inputCls} text-lg font-medium`}
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              onBlur={saveName}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              enterKeyHint="done"
            />
            {error && <span className="mt-1 block text-sm text-red-600 dark:text-red-400">{error}</span>}
          </label>

          <div>
            <span className={labelCls}>Категория</span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Chip key={c} active={dish.category === c} onClick={async () => { await updateDish(dish.id, { category: dish.category === c ? null : c }); flash(); }}>{c}</Chip>
              ))}
            </div>
          </div>

          <section>
            <span className={labelCls}>Ингредиенты · что купить</span>
            {ingredients.length > 0 && (
              <ul className="mb-2 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
                {ingredients.map((ing) =>
                  editId === ing.id ? (
                    <IngredientEditor
                      key={ing.id}
                      ing={ing}
                      product={productMap.get(ing.product_id)}
                      products={products}
                      onDone={(didSave) => { setEditId(null); if (didSave) flash(); }}
                    />
                  ) : (
                    <li key={ing.id} className="flex items-center gap-1 pl-3">
                      <button type="button" className="min-w-0 flex-1 py-2.5 text-left" onClick={() => setEditId(ing.id)}>
                        <span className="text-base">{productMap.get(ing.product_id)?.name ?? '…'}</span>
                        <span className="text-stone-500"> · {formatAmount(ing.qty, ing.unit) || 'без количества'}</span>
                        {ing.note && <span className="block text-xs text-stone-500">{ing.note}</span>}
                      </button>
                      <IconButton label="Изменить ингредиент" onClick={() => setEditId(ing.id)}>✎</IconButton>
                      <IconButton label="Удалить ингредиент" onClick={async () => { await removeIngredient(ing.id); flash('Удалено'); }}>✕</IconButton>
                    </li>
                  ),
                )}
              </ul>
            )}
            {ingredients.length === 0 && (
              <p className="mb-2 rounded-xl bg-amber-100 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                Пока пусто. Впишите, что купить, по одному: «говядина 1 кг», «лапша 2 пачки», «соль по вкусу».
              </p>
            )}
            <form onSubmit={submitIngredient} className="flex gap-2">
              <input
                id="new-ingredient"
                className={inputCls}
                list="products-list"
                placeholder="говядина 1 кг"
                value={line}
                onChange={(e) => setLine(e.target.value)}
                enterKeyHint="enter"
                aria-label="Новый ингредиент"
              />
              <Button type="submit" disabled={!parsed} className="shrink-0">＋</Button>
              <datalist id="products-list">
                {products.map((p) => <option key={p.id} value={p.name} />)}
              </datalist>
            </form>
            {parsed && (
              <p className="mt-1 text-sm text-stone-500">
                Будет добавлено: <b>{parsed.name}</b> · {formatAmount(parsed.qty, parsed.unit) || 'без количества'}
              </p>
            )}
          </section>

          <label className="block" htmlFor="dish-note">
            <span className={labelCls}>Заметка</span>
            <textarea
              id="dish-note"
              className={`${inputCls} min-h-24 py-2`}
              value={note}
              placeholder="Как готовить, на сколько порций, где покупать…"
              onChange={(e) => setNote(e.target.value)}
              onBlur={saveNote}
            />
          </label>

          <div className="space-y-2 border-t border-stone-200 pt-4 dark:border-stone-800">
            <div className="flex flex-wrap gap-2">
              {planItem ? (
                <Button variant="secondary" className="flex-1" onClick={() => removePlanItem(planItem.id)}>Убрать из меню {weekendShort(sat)}</Button>
              ) : (
                <Button variant="secondary" className="flex-1" onClick={async () => { await addDishToPlan(planId, dish.id); flash(`В меню ${weekendShort(sat)} ✓`); }}>
                  В меню {weekendShort(sat)}
                </Button>
              )}
              <Button variant="secondary" onClick={() => setPicking(true)}>На другие выходные…</Button>
            </div>
            {!confirmDelete ? (
              <Button variant="danger" className="w-full" onClick={() => setConfirmDelete(true)}>Удалить блюдо</Button>
            ) : (
              <div className="flex flex-wrap items-center gap-2 rounded-xl bg-red-50 p-3 text-sm dark:bg-red-950">
                <span className="flex-1">Удалить «{dish.name}» из библиотеки и из всех меню?</span>
                <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Отмена</Button>
                <Button className="bg-red-600 active:bg-red-700" onClick={async () => { await deleteDish(dish.id); onClose(); }}>Удалить</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-stone-200 bg-stone-50/95 px-4 pt-3 pb-[max(env(safe-area-inset-bottom),12px)] backdrop-blur dark:border-stone-800 dark:bg-stone-950/95">
        <div className="mx-auto max-w-lg">
          <Button className="w-full" onClick={saveAndClose}>Сохранить</Button>
        </div>
      </div>

      <WeekendPicker
        open={picking}
        onClose={() => setPicking(false)}
        title={`«${dish.name}» на выходные…`}
        onPick={async (s) => {
          const ok = await addDishToPlan(await getOrCreatePlan(s), dish.id);
          setPicking(false);
          flash(ok ? `Добавлено на ${weekendShort(s)} ✓` : `Уже в меню ${weekendShort(s)}`);
        }}
      />
    </div>
  );
}

function IngredientEditor({ ing, product, products, onDone }) {
  const [name, setName] = useState(product?.name ?? '');
  const [qty, setQty] = useState(formatQty(ing.qty));
  const [unit, setUnit] = useState(ing.unit ?? 'шт');
  const [aisle, setAisle] = useState(product?.aisle ?? AISLES[AISLES.length - 1]);
  const [note, setNote] = useState(ing.note ?? '');

  const save = async (e) => {
    e.preventDefault();
    const n = Number(qty.replace(',', '.'));
    const newName = name.trim();
    await updateIngredient(ing.id, {
      name: newName && newName !== product?.name ? newName : undefined,
      aisle: aisle !== product?.aisle ? aisle : undefined,
      qty: unit === TO_TASTE || qty.trim() === '' || !Number.isFinite(n) ? null : n,
      unit,
      note: note.trim(),
    });
    onDone(true);
  };

  return (
    <li className="bg-stone-50 p-3 dark:bg-stone-950">
      <form onSubmit={save} className="space-y-3">
        <label className="block">
          <span className={labelCls}>Продукт</span>
          <input className={inputCls} list="products-list" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </label>
        <div className="flex gap-2">
          <label className="block w-28">
            <span className={labelCls}>Сколько</span>
            <input className={inputCls} inputMode="decimal" value={unit === TO_TASTE ? '' : qty} disabled={unit === TO_TASTE} onChange={(e) => setQty(e.target.value)} />
          </label>
          <label className="block flex-1">
            <span className={labelCls}>Единица</span>
            <select className={inputCls} value={unit} onChange={(e) => setUnit(e.target.value)}>
              {UNITS.map((u) => <option key={u}>{u}</option>)}
            </select>
          </label>
        </div>
        <label className="block">
          <span className={labelCls}>Отдел в магазине</span>
          <select className={inputCls} value={aisle} onChange={(e) => setAisle(e.target.value)}>
            {AISLES.map((a) => <option key={a}>{a}</option>)}
          </select>
        </label>
        <label className="block">
          <span className={labelCls}>Примечание</span>
          <input className={inputCls} placeholder="например, маленькая" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">Готово</Button>
          <Button variant="ghost" onClick={() => onDone(false)}>Отмена</Button>
        </div>
      </form>
    </li>
  );
}
