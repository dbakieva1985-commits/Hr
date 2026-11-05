import { useCallback, useEffect, useState } from 'react';
import { ensureActivePlan, getOrCreatePlan, seedWeek } from './db.js';
import { LAST_MENU } from './lib/seed.js';
import { nearestSaturday } from './lib/week.js';
import { CalendarScreen } from './screens/CalendarScreen.jsx';
import { DishCard } from './screens/DishCard.jsx';
import { DishesScreen } from './screens/DishesScreen.jsx';
import { MenuScreen } from './screens/MenuScreen.jsx';
import { ShoppingScreen } from './screens/ShoppingScreen.jsx';

const TABS = [
  { id: 'menu', label: 'Меню', icon: '🍽' },
  { id: 'shop', label: 'Покупки', icon: '🛒' },
  { id: 'dishes', label: 'Блюда', icon: '📖' },
  { id: 'calendar', label: 'Календарь', icon: '📅' },
];

function tabFromHash() {
  const h = location.hash.slice(1);
  return TABS.some((t) => t.id === h) ? h : 'menu';
}

/** Keeps the nearest weekend active (F1) and tracks which weekend the user is looking at. */
function useWeekend() {
  const [sat, setSat] = useState(() => nearestSaturday());
  const [planId, setPlanId] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cur = nearestSaturday();
    const refresh = () => ensureActivePlan().then(() => {
      const now = nearestSaturday();
      if (now !== cur) { setSat((s) => (s === cur ? now : s)); cur = now; } // week rolled over
      setReady(true);
    });
    seedWeek(LAST_MENU).catch(() => {}).finally(refresh);
    const t = setInterval(refresh, 60_000);
    const onVis = () => document.visibilityState === 'visible' && refresh();
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    let alive = true;
    getOrCreatePlan(sat).then((id) => alive && setPlanId(id));
    return () => { alive = false; };
  }, [sat, ready]);

  return { sat, setSat, planId: ready ? planId : null };
}

export default function App() {
  const { sat, setSat, planId } = useWeekend();
  const [tab, setTab] = useState(tabFromHash);
  const [dishId, setDishId] = useState(null);
  const closeDish = useCallback(() => setDishId(null), []);

  useEffect(() => { history.replaceState(null, '', `#${tab}`); window.scrollTo(0, 0); }, [tab]);
  useEffect(() => {
    const onHash = () => setTab(tabFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (!planId) return null;
  const openWeekend = (s) => { setSat(s); setTab('menu'); };

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col">
      <main className="flex-1 pb-20">
        {tab === 'menu' && <MenuScreen sat={sat} setSat={setSat} planId={planId} openDish={setDishId} goShopping={() => setTab('shop')} />}
        {tab === 'shop' && <ShoppingScreen sat={sat} planId={planId} openDish={setDishId} />}
        {tab === 'dishes' && <DishesScreen sat={sat} planId={planId} openDish={setDishId} />}
        {tab === 'calendar' && <CalendarScreen openWeekend={openWeekend} openDish={setDishId} />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-stone-800 dark:bg-stone-900/95">
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          {TABS.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? 'page' : undefined}
                className={`flex h-16 w-full flex-col items-center justify-center gap-0.5 text-xs ${
                  tab === t.id ? 'font-semibold text-emerald-700 dark:text-emerald-400' : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                <span className="text-xl leading-none" aria-hidden>{t.icon}</span>
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {dishId != null && <DishCard dishId={dishId} planId={planId} sat={sat} onClose={closeDish} />}
    </div>
  );
}
