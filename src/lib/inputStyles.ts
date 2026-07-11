export type FieldSize = "sm" | "md" | "lg";

/** Base styling shared by text-like inputs and the date picker trigger. */
export const inputBase =
  "block w-full rounded-md border bg-white text-gray-900 placeholder:text-gray-400 " +
  "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 " +
  "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

export const inputBorder = "border-gray-300 hover:border-gray-400";
export const inputBorderError = "border-red-500 hover:border-red-500 focus-visible:ring-red-500";

export const inputSizes: Record<FieldSize, string> = {
  sm: "h-8 px-2.5 text-sm",
  md: "h-10 px-3 text-sm",
  lg: "h-12 px-4 text-base",
};
