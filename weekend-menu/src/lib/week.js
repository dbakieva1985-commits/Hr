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

export function addWeeks(satISO, n) {
  const d = fromISODate(satISO);
  d.setDate(d.getDate() + 7 * n);
  return toISODate(d);
}

const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const MONTHS_NOM = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

/** «7–8 ноя» / «31 окт – 1 ноя» */
export function weekendShort(satISO) {
  const sat = fromISODate(satISO);
  const sun = new Date(sat);
  sun.setDate(sun.getDate() + 1);
  if (sat.getMonth() === sun.getMonth()) return `${sat.getDate()}–${sun.getDate()} ${MONTHS_SHORT[sun.getMonth()]}`;
  return `${sat.getDate()} ${MONTHS_SHORT[sat.getMonth()]} – ${sun.getDate()} ${MONTHS_SHORT[sun.getMonth()]}`;
}

/** «Ноябрь 2026» — month of the Saturday. */
export function monthTitle(satISO) {
  const d = fromISODate(satISO);
  return `${MONTHS_NOM[d.getMonth()]} ${d.getFullYear()}`;
}

/** 'past' | 'current' | 'future' relative to `now`. */
export function weekendStatus(satISO, now = new Date()) {
  if (isWeekendOver(satISO, now)) return 'past';
  return satISO === nearestSaturday(now) ? 'current' : 'future';
}

/** Human label relative to the current weekend: «эти выходные», «следующие», «через 2 недели». */
export function relativeLabel(satISO, now = new Date()) {
  const cur = nearestSaturday(now);
  const diff = Math.round((fromISODate(satISO) - fromISODate(cur)) / (7 * 86400000));
  if (diff === 0) return 'эти выходные';
  if (diff === 1) return 'следующие';
  if (diff === -1) return 'прошлые';
  if (diff > 1) return `через ${diff} ${diff < 5 ? 'недели' : 'недель'}`;
  return `${-diff} ${-diff < 5 ? 'недели' : 'недель'} назад`;
}
