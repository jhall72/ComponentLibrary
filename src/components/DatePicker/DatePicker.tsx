import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { inputBase, inputBorder, inputBorderError, inputSizes, type FieldSize } from "@/lib/inputStyles";
import { Field } from "@/components/internal/Field";
import { Calendar } from "@/components/internal/Calendar";
import { formatDate } from "@/lib/dates";

export interface DatePickerProps {
  /** Controlled selected date. */
  value?: Date | null;
  /** Initial date for uncontrolled usage. */
  defaultValue?: Date | null;
  /** Called with the newly selected date. */
  onChange?: (date: Date) => void;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  size?: FieldSize;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** Earliest selectable date (inclusive). */
  min?: Date | null;
  /** Latest selectable date (inclusive). */
  max?: Date | null;
  /** 0 = Sunday (default) through 6 = Saturday. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** BCP 47 locale used for formatting; defaults to the runtime locale. */
  locale?: string;
  /** How the selected date is rendered in the trigger. */
  format?: (date: Date) => string;
  id?: string;
  name?: string;
  className?: string;
}

export function DatePicker({
  value,
  defaultValue = null,
  onChange,
  label,
  hint,
  error,
  placeholder = "Select a date",
  size = "md",
  fullWidth = false,
  disabled = false,
  required = false,
  min,
  max,
  weekStartsOn = 0,
  locale,
  format,
  id,
  name,
  className,
}: DatePickerProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<Date | null>(defaultValue);
  const selected = isControlled ? value : internal;

  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<Date>(selected ?? new Date());

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reactId = useId();
  const inputId = id ?? reactId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  const toggleOpen = () => {
    if (disabled) return;
    // Re-center the calendar on the selection each time it opens.
    if (!open && selected) setViewMonth(selected);
    setOpen((o) => !o);
  };

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const handleSelect = (date: Date) => {
    if (!isControlled) setInternal(date);
    onChange?.(date);
    close();
  };

  const display = selected ? (format ? format(selected) : formatDate(selected, locale)) : "";

  const trigger = (
    <button
      ref={triggerRef}
      type="button"
      id={inputId}
      disabled={disabled}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      onClick={toggleOpen}
      className={cn(
        inputBase,
        error ? inputBorderError : inputBorder,
        inputSizes[size],
        "flex items-center justify-between gap-2 text-left",
        !display && "text-gray-400",
      )}
    >
      <span className="truncate">{display || placeholder}</span>
      <svg className="size-4 shrink-0 text-gray-400" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M11 1.5v2M5 1.5v2M2 6h12M3 3h10a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );

  const control = (
    <div
      ref={rootRef}
      className={cn("relative", fullWidth ? "w-full" : "w-56", className)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.preventDefault();
          close();
        }
      }}
    >
      {name && <input type="hidden" name={name} value={selected ? selected.toISOString() : ""} />}
      {trigger}
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={typeof label === "string" ? label : "Choose date"}
          className="absolute z-50 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          <Calendar
            month={viewMonth}
            onMonthChange={setViewMonth}
            selected={selected}
            onSelect={handleSelect}
            min={min}
            max={max}
            weekStartsOn={weekStartsOn}
            locale={locale}
          />
        </div>
      )}
    </div>
  );

  if (!label && !hint && !error) return control;

  return (
    <Field
      htmlFor={inputId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={fullWidth ? "w-full" : "w-56"}
    >
      {control}
    </Field>
  );
}
