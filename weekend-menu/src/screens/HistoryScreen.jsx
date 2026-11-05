import { useLiveQuery } from 'dexie-react-hooks';
import { useRef, useState } from 'react';
import { db, exportAll, importAll } from '../db.js';
import { toMap } from '../hooks.js';
import { weekendTitle } from '../lib/week.js';
import { Button, Empty, Header } from '../components/ui.jsx';

export function HistoryScreen({ openDish }) {
  const fileRef = useRef(null);
  const [msg, setMsg] = useState('');
  const [pending, setPending] = useState(null);
  const weeks = useLiveQuery(async () => {
    const [plans, items, dishes] = await Promise.all([
      db.weekPlans.where('status').equals('closed').toArray(),
      db.planItems.toArray(),
      db.dishes.toArray(),
    ]);
    const dishMap = toMap(dishes);
    return plans
      .sort((a, b) => b.sat_date.localeCompare(a.sat_date))
      .map((p) => ({
        ...p,
        items: items
          .filter((i) => i.plan_id === p.id)
          .sort((a, b) => a.order - b.order)
          .map((i) => ({ ...i, dish: dishMap.get(i.dish_id) }))
          .filter((i) => i.dish),
      }));
  }, [], []);

  const doExport = async () => {
    const data = await exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
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
    try {
      setPending(JSON.parse(await file.text()));
      setMsg('');
    } catch {
      setMsg('Файл не читается как JSON');
    }
  };

  const applyImport = async () => {
    try {
      await importAll(pending);
      setPending(null);
      setMsg('Данные восстановлены');
      location.reload();
    } catch (err) {
      setMsg(`Не получилось: ${err.message}`);
    }
  };

  return (
    <>
      <Header title="История" subtitle="Прошлые выходные" />
      {weeks.length === 0 && <Empty>Здесь появятся меню прошлых выходных — неделя закрывается в воскресенье в 23:59.</Empty>}
      <ul className="space-y-3 px-4 pt-3">
        {weeks.map((w) => {
          const cooked = w.items.filter((i) => i.cooked).length;
          return (
            <li key={w.id} className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-semibold">{weekendTitle(w.sat_date)}</h2>
                <span className="text-xs text-stone-500">приготовлено {cooked} из {w.items.length}</span>
              </div>
              <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                {w.items.map((i) => (
                  <li key={i.id}>
                    <button type="button" className={i.cooked ? '' : 'text-stone-400'} onClick={() => openDish(i.dish.id)}>
                      {i.cooked ? '✓ ' : ''}{i.dish.name}
                      {i.day && <span className="text-xs text-stone-500"> · {i.day === 'sat' ? 'Сб' : 'Вс'}</span>}
                    </button>
                  </li>
                ))}
                {w.items.length === 0 && <li className="text-stone-400">меню было пустым</li>}
              </ul>
            </li>
          );
        })}
      </ul>

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
    </>
  );
}
