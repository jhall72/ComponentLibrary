import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  addDays,
  addMonths,
  formatDate,
  getCalendarDays,
  getWeekdayLabels,
  isOutsideRange,
  isSameDay,
  isSameMonth,
  startOfDay,
  type Weekday,
} from "@/lib/dates";

export interface CalendarProps {
  /** The month currently shown (any date within it). */
  month: Date;
  onMonthChange: (month: Date) => void;
  selected?: Date | null;
  onSelect: (date: Date) => void;
  min?: Date | null;
  max?: Date | null;
  weekStartsOn?: Weekday;
  locale?: string;
  /** Reference "today" — injectable so it stays deterministic in tests. */
  today?: Date;
}

export function Calendar({
  month,
  onMonthChange,
  selected,
  onSelect,
  min,
  max,
  weekStartsOn = 0,
  locale,
  today = new Date(),
}: CalendarProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [focusDate, setFocusDate] = useState<Date>(() => selected ?? startOfDay(today));
  // Only move DOM focus when navigation happened inside the grid, not on open.
  const shouldFocus = useRef(false);

  const days = getCalendarDays(month, weekStartsOn);
  const weekdays = getWeekdayLabels(weekStartsOn, locale);
  const monthLabel = formatDate(month, locale, { year: "numeric", month: "long" });

  useEffect(() => {
    if (!shouldFocus.current || !gridRef.current) return;
    shouldFocus.current = false;
    const key = focusDate.toDateString();
    const btn = gridRef.current.querySelector<HTMLButtonElement>(`[data-day="${key}"]`);
    btn?.focus();
  }, [focusDate]);

  const moveFocus = (next: Date) => {
    shouldFocus.current = true;
    setFocusDate(next);
    if (!isSameMonth(next, month)) onMonthChange(next);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next: Date;
    switch (e.key) {
      case "ArrowLeft":
        next = addDays(focusDate, -1);
        break;
      case "ArrowRight":
        next = addDays(focusDate, 1);
        break;
      case "ArrowUp":
        next = addDays(focusDate, -7);
        break;
      case "ArrowDown":
        next = addDays(focusDate, 7);
        break;
      case "PageUp":
        next = addMonths(focusDate, -1);
        break;
      case "PageDown":
        next = addMonths(focusDate, 1);
        break;
      case "Home":
        next = addDays(focusDate, -((focusDate.getDay() - weekStartsOn + 7) % 7));
        break;
      case "End":
        next = addDays(focusDate, 6 - ((focusDate.getDay() - weekStartsOn + 7) % 7));
        break;
      case "Enter":
      case " ":
        if (!isOutsideRange(focusDate, min, max)) {
          e.preventDefault();
          onSelect(focusDate);
        }
        return;
      default:
        return;
    }
    e.preventDefault();
    moveFocus(next);
  };

  const navBtn =
    "inline-flex size-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500";

  return (
    <div className="w-64 select-none p-3">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" aria-label="Previous month" className={navBtn} onClick={() => onMonthChange(addMonths(month, -1))}>
          <svg className="size-4" viewBox="0 0 16 16" fill="none">
            <path d="M10 3l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div aria-live="polite" className="text-sm font-semibold text-gray-800">
          {monthLabel}
        </div>
        <button type="button" aria-label="Next month" className={navBtn} onClick={() => onMonthChange(addMonths(month, 1))}>
          <svg className="size-4" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7" role="presentation">
        {weekdays.map((w) => (
          <div key={w} className="flex h-8 items-center justify-center text-xs font-medium text-gray-400">
            {w}
          </div>
        ))}
      </div>

      <div ref={gridRef} role="grid" className="grid grid-cols-7" onKeyDown={onKeyDown}>
        {days.map((day) => {
          const outside = isOutsideRange(day, min, max);
          const inMonth = isSameMonth(day, month);
          const isSelected = isSameDay(day, selected);
          const isToday = isSameDay(day, today);
          const isFocusTarget = isSameDay(day, focusDate);
          return (
            <button
              key={day.toDateString()}
              type="button"
              role="gridcell"
              data-day={day.toDateString()}
              tabIndex={isFocusTarget ? 0 : -1}
              disabled={outside}
              aria-selected={isSelected}
              aria-current={isToday ? "date" : undefined}
              onClick={() => onSelect(day)}
              onFocus={() => setFocusDate(day)}
              className={cn(
                "flex h-9 items-center justify-center rounded-md text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                !inMonth && "text-gray-300",
                inMonth && !isSelected && "text-gray-700 hover:bg-gray-100",
                isSelected && "bg-brand-600 font-semibold text-white hover:bg-brand-700",
                isToday && !isSelected && "font-semibold text-brand-600",
                outside && "cursor-not-allowed text-gray-200 hover:bg-transparent",
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
