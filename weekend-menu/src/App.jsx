import { useCallback, useEffect, useState } from 'react';
import { ensureActivePlan } from './db.js';
import { DishCard } from './screens/DishCard.jsx';
import { DishesScreen } from './screens/DishesScreen.jsx';
import { HistoryScreen } from './screens/HistoryScreen.jsx';
import { MenuScreen } from './screens/MenuScreen.jsx';
import { ShoppingScreen } from './screens/ShoppingScreen.jsx';

const TABS = [
  { id: 'menu', label: 'Меню', icon: '🍽' },
  { id: 'shop', label: 'Покупки', icon: '🛒' },
  { id: 'dishes', label: 'Блюда', icon: '📖' },
  { id: 'history', label: 'История', icon: '🕘' },
];

function tabFromHash() {
  const h = location.hash.slice(1);
  return TABS.some((t) => t.id === h) ? h : 'menu';
}

function useActivePlan() {
  const [planId, setPlanId] = useState(null);
  useEffect(() => {
    const refresh = () => ensureActivePlan().then(setPlanId);
    refresh();
    const t = setInterval(refresh, 60_000);
    const onVis = () => document.visibilityState === 'visible' && refresh();
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', onVis); };
  }, []);
  return planId;
}

export default function App() {
  const planId = useActivePlan();
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

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col">
      <main className="flex-1 pb-20">
        {tab === 'menu' && <MenuScreen planId={planId} openDish={setDishId} goShopping={() => setTab('shop')} />}
        {tab === 'shop' && <ShoppingScreen planId={planId} openDish={setDishId} />}
        {tab === 'dishes' && <DishesScreen planId={planId} openDish={setDishId} />}
        {tab === 'history' && <HistoryScreen openDish={setDishId} />}
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

      {dishId != null && <DishCard dishId={dishId} planId={planId} onClose={closeDish} />}
    </div>
  );
}
