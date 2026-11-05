// F1: the active plan is always the nearest Saturday + Sunday.
const MONTHS_GEN = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

const pad = (n) => String(n).padStart(2, '0');

export function toISODate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromISODate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Saturday of the weekend the user is planning for at `now`. Sat/Sun → this weekend; Mon–Fri → the coming one. */
export function nearestSaturday(now = new Date()) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dow = d.getDay(); // 0 Sun … 6 Sat
  const delta = dow === 0 ? -1 : 6 - dow;
  d.setDate(d.getDate() + delta);
  return toISODate(d);
}

/** The weekend is over once Sunday 23:59 has passed. */
export function isWeekendOver(satISO, now = new Date()) {
  const mondayStart = fromISODate(satISO);
  mondayStart.setDate(mondayStart.getDate() + 2);
  return now >= mondayStart;
}

/** «Выходные 7–8 ноября» / «Выходные 31 октября – 1 ноября» */
export function weekendTitle(satISO) {
  const sat = fromISODate(satISO);
  const sun = new Date(sat);
  sun.setDate(sun.getDate() + 1);
  if (sat.getMonth() === sun.getMonth()) {
    return `Выходные ${sat.getDate()}–${sun.getDate()} ${MONTHS_GEN[sun.getMonth()]}`;
  }
  return `Выходные ${sat.getDate()} ${MONTHS_GEN[sat.getMonth()]} – ${sun.getDate()} ${MONTHS_GEN[sun.getMonth()]}`;
}

export function daysBetween(fromISO, to = new Date()) {
  const ms = to - new Date(fromISO);
  return Math.floor(ms / 86400000);
}
