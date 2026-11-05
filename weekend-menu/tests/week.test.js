import { describe, expect, it } from 'vitest';
import { isWeekendOver, nearestSaturday, weekendTitle } from '../src/lib/week.js';

describe('week', () => {
  it('weekday → coming Saturday', () => {
    expect(nearestSaturday(new Date(2026, 10, 4))).toBe('2026-11-07'); // Wed
    expect(nearestSaturday(new Date(2026, 10, 2))).toBe('2026-11-07'); // Mon
  });
  it('weekend → this weekend', () => {
    expect(nearestSaturday(new Date(2026, 10, 7, 10))).toBe('2026-11-07'); // Sat
    expect(nearestSaturday(new Date(2026, 10, 8, 23, 59))).toBe('2026-11-07'); // Sun
  });
  it('closes after Sunday 23:59', () => {
    expect(isWeekendOver('2026-11-07', new Date(2026, 10, 8, 23, 59))).toBe(false);
    expect(isWeekendOver('2026-11-07', new Date(2026, 10, 9, 0, 0))).toBe(true);
  });
  it('title', () => {
    expect(weekendTitle('2026-11-07')).toBe('Выходные 7–8 ноября');
    expect(weekendTitle('2026-10-31')).toBe('Выходные 31 октября – 1 ноября');
  });
});
