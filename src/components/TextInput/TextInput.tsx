import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { inputBase, inputBorder, inputBorderError, inputSizes, type FieldSize } from "@/lib/inputStyles";
import { Field } from "@/components/internal/Field";

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Label rendered above the input. */
  label?: ReactNode;
  /** Helper text shown below the input. */
  hint?: ReactNode;
  /** Error message; when set, the input renders in an error state. */
  error?: ReactNode;
  /** Size of the input. */
  size?: FieldSize;
  /** Stretch the field to fill its container. */
  fullWidth?: boolean;
  /** Content rendered inside the input, before the text (e.g. an icon). */
  leftAdornment?: ReactNode;
  /** Content rendered inside the input, after the text. */
  rightAdornment?: ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      hint,
      error,
      size = "md",
      fullWidth = false,
      leftAdornment,
      rightAdornment,
      className,
      id,
      disabled,
      required,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const reactId = useId();
    const inputId = id ?? reactId;
    const describedBy =
      [ariaDescribedBy, error ? `${inputId}-error` : hint ? `${inputId}-hint` : null]
        .filter(Boolean)
        .join(" ") || undefined;

    const input = (
      <div className={cn("relative flex items-center", !fullWidth && "w-fit")}>
        {leftAdornment && (
          <span className="pointer-events-none absolute left-3 flex text-gray-400">{leftAdornment}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            inputBase,
            error ? inputBorderError : inputBorder,
            inputSizes[size],
            leftAdornment && "pl-9",
            rightAdornment && "pr-9",
            className,
          )}
          {...props}
        />
        {rightAdornment && (
          <span className="absolute right-3 flex text-gray-400">{rightAdornment}</span>
        )}
      </div>
    );

    if (!label && !hint && !error) {
      return input;
    }

    return (
      <Field
        htmlFor={inputId}
        label={label}
        hint={hint}
        error={error}
        required={required}
        className={fullWidth ? "w-full" : "w-fit"}
      >
        {input}
      </Field>
    );
  },
);

TextInput.displayName = "TextInput";
