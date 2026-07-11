export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function addMonths(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + amount);
  return d;
}

export function addDays(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

/** True when `date` falls outside the inclusive [min, max] range. */
export function isOutsideRange(date: Date, min?: Date | null, max?: Date | null): boolean {
  const d = startOfDay(date).getTime();
  if (min && d < startOfDay(min).getTime()) return true;
  if (max && d > startOfDay(max).getTime()) return true;
  return false;
}

/**
 * Return a flat list of dates forming the calendar grid for `month`'s month,
 * padded with leading/trailing days so every week is complete.
 */
export function getCalendarDays(month: Date, weekStartsOn: Weekday = 0): Date[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const leading = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -leading);

  const days: Date[] = [];
  // 6 weeks always keeps the grid a stable height across months.
  for (let i = 0; i < 42; i++) {
    days.push(addDays(start, i));
  }
  return days;
}

export function getWeekdayLabels(weekStartsOn: Weekday = 0, locale?: string): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
  // 2021-08-01 is a Sunday — a stable anchor for building weekday names.
  const sunday = new Date(2021, 7, 1);
  return Array.from({ length: 7 }, (_, i) =>
    fmt.format(addDays(sunday, (i + weekStartsOn) % 7)),
  );
}

export function formatDate(date: Date, locale?: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(
    locale,
    options ?? { year: "numeric", month: "short", day: "numeric" },
  ).format(date);
}
