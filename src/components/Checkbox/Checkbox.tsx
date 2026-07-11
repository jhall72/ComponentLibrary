import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Label rendered next to the checkbox. */
  label?: ReactNode;
  /** Helper text shown below the label. */
  hint?: ReactNode;
  /** Error message; when set, the checkbox renders in an error state. */
  error?: ReactNode;
  /** Renders the mixed/indeterminate state. */
  indeterminate?: boolean;
  /** Size of the checkbox. */
  size?: "sm" | "md";
}

const boxSizes = {
  sm: "size-4",
  md: "size-5",
} as const;

const iconSizes = {
  sm: "size-3",
  md: "size-3.5",
} as const;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, hint, error, indeterminate = false, size = "md", className, id, disabled, checked, ...props },
    ref,
  ) => {
    const innerRef = useRef<HTMLInputElement>(null);
    const reactId = useId();
    const inputId = id ?? reactId;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

    // Keep the ref forwarded while still owning it locally to set `indeterminate`.
    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <label
          htmlFor={inputId}
          className={cn(
            "inline-flex items-start gap-2",
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          )}
        >
          <span className="relative inline-flex shrink-0 items-center justify-center">
            <input
              ref={setRefs}
              id={inputId}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              className="peer sr-only"
              {...props}
            />
            <span
              aria-hidden="true"
              className={cn(
                "flex items-center justify-center rounded border bg-white transition-colors",
                boxSizes[size],
                error ? "border-red-500" : "border-gray-300 peer-hover:border-gray-400",
                "peer-checked:border-brand-600 peer-checked:bg-brand-600",
                "peer-indeterminate:border-brand-600 peer-indeterminate:bg-brand-600",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-1",
              )}
            >
              {indeterminate ? (
                <svg className={cn("text-white", iconSizes[size])} viewBox="0 0 16 16" fill="none">
                  <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                /* Always white: invisible on the white (unchecked) box, visible once the
                   box turns brand via peer-checked. Avoids relying on peer-checked on a
                   nested element, which the sibling combinator can't reach. */
                <svg className={cn("text-white", iconSizes[size])} viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3.5 8.5l3 3 6-6.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </span>
          {label && <span className="text-sm text-gray-700 select-none">{label}</span>}
        </label>
        {error ? (
          <p id={`${inputId}-error`} className="ml-7 text-sm text-red-600">
            {error}
          </p>
        ) : (
          hint && (
            <p id={`${inputId}-hint`} className="ml-7 text-sm text-gray-500">
              {hint}
            </p>
          )
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
