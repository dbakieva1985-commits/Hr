import { useMemo, useState } from 'react';
import { quickAdd } from '../db.js';
import { normalizeName } from '../lib/parse.js';
import { Sheet, inputCls } from './ui.jsx';

/** F2: «+» → type → tap a suggestion (2 taps). Unknown name creates a draft dish. */
export function QuickAdd({ open, onClose, planId, dishes, inPlan }) {
  const [q, setQ] = useState('');
  const key = normalizeName(q);

  const suggestions = useMemo(() => {
    const list = dishes.filter((d) => !inPlan.has(d.id));
    if (!key) return list.sort((a, b) => (b.last_cooked_at ?? '').localeCompare(a.last_cooked_at ?? '')).slice(0, 8);
    return list
      .filter((d) => d.key.includes(key))
      .sort((a, b) => a.key.indexOf(key) - b.key.indexOf(key) || a.name.localeCompare(b.name, 'ru'))
      .slice(0, 8);
  }, [dishes, inPlan, key]);
  const exact = dishes.find((d) => d.key === key);

  const add = async (name) => {
    if (!name.trim()) return;
    await quickAdd(planId, name);
    setQ('');
    onClose();
  };
  const close = () => { setQ(''); onClose(); };

  return (
    <Sheet open={open} onClose={close} title="Добавить блюдо">
      <form onSubmit={(e) => { e.preventDefault(); add(suggestions[0] && !exact && key && suggestions[0].key.startsWith(key) ? suggestions[0].name : q); }}>
        <input
          autoFocus
          className={inputCls}
          placeholder="Например, солянка"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          enterKeyHint="done"
        />
      </form>
      <ul className="mt-3 divide-y divide-stone-200 dark:divide-stone-800">
        {key && !exact && (
          <li>
            <button type="button" className="flex min-h-12 w-full items-center gap-2 text-left" onClick={() => add(q)}>
              <span className="text-emerald-600">＋</span> Новое блюдо «{q.trim()}»
              <span className="ml-auto text-xs text-stone-500">ингредиенты потом</span>
            </button>
          </li>
        )}
        {suggestions.map((d) => (
          <li key={d.id}>
            <button type="button" className="flex min-h-12 w-full items-center gap-2 text-left" onClick={() => add(d.name)}>
              {d.name}
              {d.category && <span className="text-xs text-stone-500">{d.category}</span>}
              {d.is_draft ? <span className="ml-auto text-xs text-amber-600">без ингредиентов</span> : null}
            </button>
          </li>
        ))}
        {!key && suggestions.length === 0 && (
          <li className="py-3 text-sm text-stone-500">Начните вводить название — новое блюдо сохранится в библиотеку.</li>
        )}
      </ul>
    </Sheet>
  );
}
