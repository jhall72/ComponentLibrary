import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface FieldProps {
  /** id of the control this field labels; wires up `htmlFor`. */
  htmlFor?: string;
  label?: ReactNode;
  /** Helper text shown below the control when there is no error. */
  hint?: ReactNode;
  /** Error message shown below the control; overrides `hint`. */
  error?: ReactNode;
  /** Marks the field visually as required. */
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Layout wrapper providing a label above and hint/error text below a control.
 * The `hintId`/`errorId` should be wired into the control's `aria-describedby`.
 */
export function Field({
  htmlFor,
  label,
  hint,
  error,
  required,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} className="text-sm text-red-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={htmlFor ? `${htmlFor}-hint` : undefined} className="text-sm text-gray-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
