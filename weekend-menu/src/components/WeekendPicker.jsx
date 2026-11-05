import { usePlansIndex } from '../hooks.js';
import { addWeeks, nearestSaturday, relativeLabel, weekendTitle } from '../lib/week.js';
import { Sheet } from './ui.jsx';

const AHEAD = 9;

/** Pick one of the coming weekends. Calls onPick(satISO). */
export function WeekendPicker({ open, onClose, onPick, title = 'На какие выходные?', excludeSat }) {
  const index = usePlansIndex();
  const cur = nearestSaturday();
  const weeks = Array.from({ length: AHEAD }, (_, i) => addWeeks(cur, i)).filter((s) => s !== excludeSat);
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <ul className="divide-y divide-stone-200 dark:divide-stone-800">
        {weeks.map((sat) => {
          const count = index.get(sat)?.count ?? 0;
          return (
            <li key={sat}>
              <button type="button" className="flex min-h-13 w-full items-center gap-3 py-2 text-left" onClick={() => onPick(sat)}>
                <span className="flex-1">
                  <span className="block text-base">{weekendTitle(sat).replace('Выходные ', '')}</span>
                  <span className="block text-xs text-stone-500">{relativeLabel(sat)}</span>
                </span>
                <span className="text-sm text-stone-500">{count ? `${count} блюд` : 'пусто'}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </Sheet>
  );
}
