/**
 * One meaning per colour, everywhere in the app:
 *
 * - success  green  – done, healthy, active, available
 * - info     blue   – in hand / in progress (approved, being rescued, recovering)
 * - warning  amber  – waiting for someone, needs attention (pending, reported)
 * - serious  orange – high priority, not yet an emergency
 * - danger   red    – refused, locked, critical
 * - neutral  slate  – closed, inactive, cancelled, ordinary
 * - accent   violet – a trait or identity, not a state (fostering, special needs, owner)
 *
 * Badges pair the colour with a text label, so colour never carries meaning alone.
 * Soft text keeps 4.5:1 or more on its tint in both themes.
 */
export type StatusTone = "success" | "info" | "warning" | "serious" | "danger" | "neutral" | "accent";

export const STATUS_TONE_SOFT: Record<StatusTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  info: "border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-50 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
  warning: "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-50 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  serious: "border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-50 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300",
  danger: "border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-50 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
  neutral: "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
  accent: "border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-50 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300",
};

/** For badges on photos: white text stays at 4.5:1 or more. */
export const STATUS_TONE_SOLID: Record<StatusTone, string> = {
  success: "border-transparent bg-emerald-700 text-white",
  info: "border-transparent bg-sky-700 text-white",
  warning: "border-transparent bg-amber-700 text-white",
  serious: "border-transparent bg-orange-700 text-white",
  danger: "border-transparent bg-rose-700 text-white",
  neutral: "border-transparent bg-slate-700 text-white",
  accent: "border-transparent bg-violet-700 text-white",
};

export interface StatusDisplay {
  label: string;
  tone: StatusTone;
}

/** Looks a backend value up in a display map; unknown values show as-is, in neutral. */
export function statusDisplay<K extends string>(
  map: Record<K, StatusDisplay>,
  value?: string | null,
  fallbackLabel = "Chưa rõ",
): StatusDisplay {
  return (value && map[value as K]) || { label: value || fallbackLabel, tone: "neutral" };
}
