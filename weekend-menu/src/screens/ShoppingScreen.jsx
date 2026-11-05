import { useEffect, useMemo, useState } from 'react';
import { addManualLine, deleteOverride, patchOverride, patchProductLine, setProductAisle } from '../db.js';
import { useShoppingList } from '../hooks.js';
import { AISLES } from '../lib/constants.js';
import { formatAmount, parseIngredient } from '../lib/parse.js';
import { groupByAisle, shoppingText, sourcesText } from '../lib/shopping.js';
import { weekendShort, weekendTitle } from '../lib/week.js';
import { Button, Empty, Header, IconButton, Sheet, SwipeRow, inputCls } from '../components/ui.jsx';
import { ShareButton } from '../components/ShareButton.jsx';

function useWakeLock(on) {
  useEffect(() => {
    if (!on || !('wakeLock' in navigator)) return;
    let lock;
    const req = () => navigator.wakeLock.request('screen').then((l) => { lock = l; }).catch(() => {});
    req();
    const onVis = () => document.visibilityState === 'visible' && req();
    document.addEventListener('visibilitychange', onVis);
    return () => { document.removeEventListener('visibilitychange', onVis); lock?.release().catch(() => {}); };
  }, [on]);
}

export function ShoppingScreen({ sat, planId, openDish, onBack }) {
  const { missing, lines } = useShoppingList(planId);
  const [shopMode, setShopMode] = useState(() => localStorage.getItem('shopMode') === '1');
  const [showHome, setShowHome] = useState(true);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  useWakeLock(shopMode);
  useEffect(() => { try { localStorage.setItem('shopMode', shopMode ? '1' : '0'); } catch { /* ignore */ } }, [shopMode]);

  const toBuy = lines.filter((l) => !l.haveAtHome);
  const atHome = lines.filter((l) => l.haveAtHome);
  const groups = useMemo(() => groupByAisle(toBuy), [toBuy]);
  const left = toBuy.filter((l) => !l.bought).length;

  const patch = (line, p) => (line.isManual ? patchOverride(line.override.id, p) : patchProductLine(planId, line.productId, p));

  return (
    <>
      <Header
        onBack={onBack}
        backLabel=""
        title="Покупки"
        subtitle={`${weekendShort(sat)} · ${lines.length ? (left ? `осталось ${left}` : 'всё куплено 🎉') : 'список пуст'}`}
        right={
          <Button variant={shopMode ? 'primary' : 'secondary'} className="shrink-0 px-3 text-sm whitespace-nowrap" onClick={() => setShopMode((s) => !s)}>
            🛒 {shopMode ? 'В магазине' : 'Магазин'}
          </Button>
        }
      />

      {lines.length > 0 && (
        <div className="mx-4 mt-3">
          <ShareButton
            label="📤 Отправить список"
            getText={() => shoppingText(`Покупки на ${weekendTitle(sat).replace('Выходные ', '')}`, lines)}
          />
        </div>
      )}

      {missing.length > 0 && (
        <ul className="mx-4 mt-3 space-y-1">
          {missing.map((m) => (
            <li key={m.dishId}>
              <button
                type="button"
                onClick={() => openDish(m.dishId)}
                className="w-full rounded-xl bg-amber-100 px-3 py-2 text-left text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200"
              >
                <b>{m.name}</b> — ингредиенты не заполнены
              </button>
            </li>
          ))}
        </ul>
      )}

      {lines.length === 0 && <Empty>Добавьте блюда с ингредиентами в меню этих выходных — список соберётся сам.</Empty>}

      {groups.map(({ aisle, lines: ls }) => (
        <section key={aisle} className="mt-4">
          <h2 className="px-4 pb-1 text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">{aisle}</h2>
          <ul className="divide-y divide-stone-200 dark:divide-stone-800">
            {[...ls].sort((a, b) => a.bought - b.bought).map((line) => (
              <li key={line.key}>
                <SwipeRow onSwipeLeft={() => patch(line, { have_at_home: 1, bought: 0 })}>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className={`flex min-w-0 flex-1 items-center gap-3 px-4 text-left ${shopMode ? 'min-h-16 py-3' : 'min-h-13 py-2'}`}
                      onClick={() => patch(line, { bought: line.bought ? 0 : 1 })}
                      aria-pressed={line.bought}
                    >
                      <span
                        className={`flex size-6 shrink-0 items-center justify-center rounded-md border-2 ${
                          line.bought ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-400'
                        }`}
                      >
                        {line.bought ? '✓' : ''}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block ${shopMode ? 'text-xl font-medium' : 'text-base'} ${line.bought ? 'text-stone-400 line-through' : ''}`}>
                          {line.name}
                          {line.amount && <span className="text-stone-500 dark:text-stone-400"> — {line.amount}</span>}
                        </span>
                        {line.sources.length > 0 && !line.bought && (
                          <span className="block truncate text-xs text-stone-500 dark:text-stone-400">{sourcesText(line.sources)}</span>
                        )}
                      </span>
                    </button>
                    {!line.bought && (
                      <button
                        type="button"
                        onClick={() => patch(line, { have_at_home: 1, bought: 0 })}
                        aria-label={`${line.name}: есть дома`}
                        className="mr-1 inline-flex min-h-10 shrink-0 items-center gap-1 rounded-full border border-stone-300 px-2.5 text-xs text-stone-600 active:bg-stone-200 dark:border-stone-700 dark:text-stone-300 dark:active:bg-stone-800"
                      >
                        🏠 есть
                      </button>
                    )}
                    {!shopMode && <IconButton label="Изменить" onClick={() => setEditing(line)}>✎</IconButton>}
                  </div>
                </SwipeRow>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {!shopMode && (
        <div className="mx-4 mt-4">
          <Button variant="secondary" className="w-full" onClick={() => setAdding(true)}>＋ Добавить своё</Button>
        </div>
      )}

      {atHome.length > 0 && (
        <section className="mt-6 mb-4">
          <button type="button" className="flex min-h-11 w-full items-center px-4 text-sm text-stone-500" onClick={() => setShowHome((s) => !s)}>
            {showHome ? '▾' : '▸'} 🏠 Есть дома — не покупать ({atHome.length})
          </button>
          {showHome && (
            <ul className="divide-y divide-stone-200 dark:divide-stone-800">
              {atHome.map((line) => (
                <li key={line.key} className="flex items-center px-4 py-1 text-stone-500">
                  <span className="flex-1 line-through">{line.name}{line.amount && ` — ${line.amount}`}</span>
                  <Button variant="ghost" className="text-sm" onClick={() => patch(line, { have_at_home: 0 })}>Купить всё-таки</Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
      <div className="h-6" />


      <EditLine line={editing} onClose={() => setEditing(null)} patch={patch} />
      <AddManual open={adding} onClose={() => setAdding(false)} planId={planId} />
    </>
  );
}

function EditLine({ line, onClose, patch }) {
  const [amount, setAmount] = useState('');
  useEffect(() => { if (line) setAmount(line.amount ?? ''); }, [line]);
  if (!line) return null;

  const save = async () => {
    const v = amount.trim();
    await patch(line, { qty_override: v === '' || v === line.computedAmount ? null : v });
    onClose();
  };

  return (
    <Sheet open onClose={onClose} title={line.name}>
      <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm text-stone-500">Количество{line.computedAmount && ` (по меню: ${line.computedAmount})`}</span>
          <input className={inputCls} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="например, 3 шт" />
        </label>
        {line.productId != null && (
          <label className="block">
            <span className="mb-1 block text-sm text-stone-500">Отдел (запомнится для продукта)</span>
            <select className={inputCls} value={line.aisle} onChange={(e) => setProductAisle(line.productId, e.target.value)}>
              {AISLES.map((a) => <option key={a}>{a}</option>)}
            </select>
          </label>
        )}
        {line.sources.length > 0 && <p className="text-sm text-stone-500">Для блюд: {sourcesText(line.sources)}</p>}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" className="flex-1">Сохранить</Button>
          <Button variant="secondary" onClick={async () => { await patch(line, { have_at_home: 1, bought: 0 }); onClose(); }}>Есть дома</Button>
          {line.isManual && (
            <Button variant="danger" onClick={async () => { await deleteOverride(line.override.id); onClose(); }}>Удалить</Button>
          )}
        </div>
      </form>
    </Sheet>
  );
}

function AddManual({ open, onClose, planId }) {
  const [text, setText] = useState('');
  const parsed = parseIngredient(text);
  const submit = async (e) => {
    e.preventDefault();
    if (!parsed) return;
    await addManualLine(planId, { name: parsed.name, amount: formatAmount(parsed.qty, parsed.unit) });
    setText('');
    onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title="Добавить в список">
      <form onSubmit={submit} className="space-y-3">
        <input autoFocus className={inputCls} placeholder="гранат 1 шт" value={text} onChange={(e) => setText(e.target.value)} />
        {parsed && (
          <p className="text-sm text-stone-500">
            {parsed.name}{formatAmount(parsed.qty, parsed.unit) && ` — ${formatAmount(parsed.qty, parsed.unit)}`}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={!parsed}>Добавить</Button>
      </form>
    </Sheet>
  );
}
