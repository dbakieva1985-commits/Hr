import { useLiveQuery } from 'dexie-react-hooks';
import { useRef, useState } from 'react';
import { db, exportAll, getOrCreatePlan, importAll, repeatWeek } from '../db.js';
import { toMap } from '../hooks.js';
import { buildShoppingList, groupByAisle, sourcesText } from '../lib/shopping.js';
import { addWeeks, monthTitle, nearestSaturday, relativeLabel, weekendStatus, weekendTitle } from '../lib/week.js';
import { DishActions } from '../components/DishActions.jsx';
import { WeekendPicker } from '../components/WeekendPicker.jsx';
import { Button, Header } from '../components/ui.jsx';

const AHEAD = 8;

/** All weekends: the coming two months first, then every past weekend that had a menu. */
export function CalendarScreen({ openWeekend, openDish, onBack }) {
  const fileRef = useRef(null);
  const [msg, setMsg] = useState('');
  const [pending, setPending] = useState(null);
  const [action, setAction] = useState(null);
  const [repeatFrom, setRepeatFrom] = useState(null);

  const data = useLiveQuery(async () => {
    const [plans, items, dishes, ingredients, products, overrides] = await Promise.all([
      db.weekPlans.toArray(), db.planItems.toArray(), db.dishes.toArray(),
      db.dishIngredients.toArray(), db.products.toArray(), db.shoppingOverrides.toArray(),
    ]);
    const dishMap = toMap(dishes);
    const productMap = toMap(products);
    const bySat = new Map(plans.map((p) => [p.sat_date, p]));
    const week = (sat) => {
      const plan = bySat.get(sat);
      const its = plan ? items.filter((i) => i.plan_id === plan.id).sort((a, b) => a.order - b.order) : [];
      return {
        sat,
        plan,
        items: its.map((i) => ({ ...i, dish: dishMap.get(i.dish_id) })).filter((i) => i.dish),
        list: plan
          ? buildShoppingList({ planItems: its, dishes: dishMap, ingredients, products: productMap, overrides: overrides.filter((o) => o.plan_id === plan.id) })
          : null,
      };
    };
    const cur = nearestSaturday();
    const upcoming = Array.from({ length: AHEAD + 1 }, (_, i) => week(addWeeks(cur, i)));
    const past = plans
      .filter((p) => weekendStatus(p.sat_date) === 'past')
      .sort((a, b) => b.sat_date.localeCompare(a.sat_date))
      .map((p) => week(p.sat_date))
      .filter((w) => w.items.length > 0);
    return { upcoming, past };
  }, [], { upcoming: [], past: [] });

  const doExport = async () => {
    const json = await exportAll();
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `menu-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg('Копия сохранена');
  };
  const doImport = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try { setPending(JSON.parse(await file.text())); setMsg(''); } catch { setMsg('Файл не читается как JSON'); }
  };
  const applyImport = async () => {
    try { await importAll(pending); setPending(null); location.reload(); } catch (err) { setMsg(`Не получилось: ${err.message}`); }
  };

  const repeatTo = async (sat) => {
    const to = await getOrCreatePlan(sat);
    await repeatWeek(repeatFrom.id, to);
    setRepeatFrom(null);
    openWeekend(sat);
  };

  const renderWeek = (w, withMonth) => {
    const status = weekendStatus(w.sat);
    const cooked = w.items.filter((i) => i.cooked).length;
    const lines = w.list?.lines.filter((l) => !l.haveAtHome) ?? [];
    return (
      <li key={w.sat}>
        {withMonth && <h3 className="mt-4 mb-2 text-sm font-semibold text-stone-500">{monthTitle(w.sat)}</h3>}
        <div className={`rounded-xl border p-3 ${status === 'current' ? 'border-emerald-600' : 'border-stone-200 dark:border-stone-800'}`}>
          <button type="button" className="flex w-full items-baseline gap-2 text-left" onClick={() => openWeekend(w.sat)}>
            <span className="flex-1 font-semibold">{weekendTitle(w.sat).replace('Выходные ', '')}</span>
            <span className={`text-xs ${status === 'current' ? 'font-semibold text-emerald-700 dark:text-emerald-400' : 'text-stone-500'}`}>
              {relativeLabel(w.sat)}{status === 'past' && cooked ? ` · приготовлено ${cooked}/${w.items.length}` : ''}
            </span>
            <span className="text-stone-400" aria-hidden>›</span>
          </button>

          {w.items.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {w.items.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => setAction({ dishId: i.dish.id, itemId: status === 'past' ? null : i.id })}
                  className="min-h-9 rounded-full bg-stone-100 px-3 text-sm dark:bg-stone-800"
                >
                  {i.dish.favorite ? <span className="text-amber-500">★ </span> : null}
                  {i.dish.name}
                </button>
              ))}
            </div>
          ) : (
            <button type="button" className="mt-1 min-h-9 text-sm text-emerald-700 dark:text-emerald-400" onClick={() => openWeekend(w.sat)}>
              + Запланировать
            </button>
          )}

          {(status === 'past' && w.items.length > 0) && (
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" className="min-h-9 flex-1 text-sm" onClick={() => setRepeatFrom(w.plan)}>Повторить на…</Button>
            </div>
          )}
          {status === 'past' && lines.length > 0 && <WeekList lines={lines} missing={w.list.missing} />}
        </div>
      </li>
    );
  };

  return (
    <>
      <Header onBack={onBack} backLabel="Меню" title="Календарь" subtitle="Нажмите на выходные, чтобы спланировать" />
      <section className="px-4">
        <ul>{data.upcoming.map((w, i) => renderWeek(w, i === 0 || monthTitle(w.sat) !== monthTitle(data.upcoming[i - 1].sat)))}</ul>
      </section>

      {data.past.length > 0 && (
        <section className="mt-8 px-4">
          <h2 className="mb-1 text-lg font-semibold">Прошедшие</h2>
          <p className="mb-2 text-sm text-stone-500">Нажмите на блюдо, чтобы добавить его в любимые или на другие выходные.</p>
          <ul>{data.past.map((w, i) => renderWeek(w, i === 0 || monthTitle(w.sat) !== monthTitle(data.past[i - 1].sat)))}</ul>
        </section>
      )}

      <section className="mx-4 mt-8 mb-6 rounded-xl bg-stone-100 p-3 text-sm dark:bg-stone-900">
        <h2 className="mb-1 font-semibold">Резервная копия</h2>
        <p className="mb-3 text-stone-500">Все данные хранятся только на этом телефоне. Время от времени сохраняйте копию в файл.</p>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={doExport}>Экспорт JSON</Button>
          <Button variant="secondary" className="flex-1" onClick={() => fileRef.current?.click()}>Импорт</Button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={doImport} />
        </div>
        {pending && (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-amber-100 p-2 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            <span className="flex-1">Заменить все текущие данные данными из файла?</span>
            <Button variant="ghost" onClick={() => setPending(null)}>Отмена</Button>
            <Button onClick={applyImport}>Заменить</Button>
          </div>
        )}
        {msg && <p className="mt-2 text-stone-600 dark:text-stone-300">{msg}</p>}
      </section>

      <DishActions dishId={action?.dishId} itemId={action?.itemId} onClose={() => setAction(null)} openDish={openDish} />
      <WeekendPicker open={!!repeatFrom} onClose={() => setRepeatFrom(null)} onPick={repeatTo} title="Повторить это меню на…" />
    </>
  );
}

function WeekList({ lines, missing }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 border-t border-stone-200 pt-2 dark:border-stone-800">
      <button type="button" className="min-h-9 text-sm text-emerald-700 dark:text-emerald-400" onClick={() => setOpen((o) => !o)}>
        {open ? '▾' : '▸'} Покупки ({lines.length})
      </button>
      {open && (
        <div className="space-y-2 pb-1 text-sm">
          {groupByAisle(lines).map(({ aisle, lines: ls }) => (
            <div key={aisle}>
              <div className="text-xs text-stone-500 uppercase">{aisle}</div>
              <ul>
                {ls.map((l) => (
                  <li key={l.key}>
                    {l.name}{l.amount && <span className="text-stone-500"> — {l.amount}</span>}
                    {l.sources.length > 0 && <span className="text-xs text-stone-500"> ({sourcesText(l.sources)})</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {missing.length > 0 && (
            <p className="text-xs text-amber-700 dark:text-amber-400">Без ингредиентов: {missing.map((m) => m.name).join(', ')}</p>
          )}
        </div>
      )}
    </div>
  );
}
