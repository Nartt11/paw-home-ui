/**
 * One place for dates and times, matching the API's convention:
 * - the API sends every date-time in UTC with a trailing `Z` and accepts any offset;
 * - the screens show times in Vietnam, wherever the browser is;
 * - what a person types in a date or time input is a time in Vietnam, sent with `+07:00`.
 */

export const VN_TIME_ZONE = "Asia/Ho_Chi_Minh";
const VN_LOCALE = "vi-VN";
/** Vietnam has no daylight saving time. */
const VN_OFFSET = "+07:00";

const HAS_OFFSET = /(Z|[+-]\d{2}:?\d{2})$/i;
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Reads a date-time from the API. A value without an offset is taken as UTC, which is how the API
 * sent times before it added `Z`. Fractions beyond milliseconds are cut, since not every browser
 * parses them.
 */
export function parseApiDate(value: string): Date {
  const trimmed = value.trim();
  if (DATE_ONLY.test(trimmed)) {
    return new Date(`${trimmed}T00:00:00${VN_OFFSET}`);
  }
  const withOffset = HAS_OFFSET.test(trimmed) ? trimmed : `${trimmed}Z`;
  return new Date(withOffset.replace(/(\.\d{3})\d+/, "$1"));
}

function valid(value?: string | null): Date | null {
  if (!value) return null;
  const date = parseApiDate(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** 12/11/2026, in Vietnam. */
export function formatDate(
  value?: string | null,
  options: Intl.DateTimeFormatOptions = {},
  fallback = "—",
) {
  const date = valid(value);
  return date
    ? date.toLocaleDateString(VN_LOCALE, { timeZone: VN_TIME_ZONE, ...options })
    : fallback;
}

/** 17:00 12/11/2026, in Vietnam. */
export function formatDateTime(
  value?: string | null,
  options: Intl.DateTimeFormatOptions = {},
  fallback = "—",
) {
  const date = valid(value);
  return date
    ? date.toLocaleString(VN_LOCALE, { timeZone: VN_TIME_ZONE, ...options })
    : fallback;
}

/** "5 phút trước"; past a week, the date. */
export function formatRelativeTime(value?: string | null) {
  const date = valid(value);
  if (!date) return "";
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return formatDate(value, {}, "");
}

const VN_PARTS = new Intl.DateTimeFormat("en-CA", {
  timeZone: VN_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function vnParts(date: Date) {
  const parts = Object.fromEntries(
    VN_PARTS.formatToParts(date).map((part) => [part.type, part.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
}

/** Value for an `<input type="datetime-local">`: "2026-11-12T17:00", in Vietnam. */
export function toDateTimeLocalValue(value: string | Date | null | undefined = new Date()) {
  const date = value instanceof Date ? value : valid(value);
  if (!date) return "";
  const { date: day, time } = vnParts(date);
  return `${day}T${time}`;
}

/** Value for an `<input type="date">`: "2026-11-12", in Vietnam. */
export function toDateInputValue(value: string | Date | null | undefined) {
  const date = value instanceof Date ? value : valid(value);
  return date ? vnParts(date).date : "";
}

/**
 * What a person typed in a date or datetime-local input, ready for the API: the same wall-clock
 * time in Vietnam, with its offset. Empty stays empty.
 */
export function toApiDateTime(input?: string | null) {
  const value = input?.trim() ?? "";
  if (!value) return "";
  if (HAS_OFFSET.test(value)) return value;
  if (DATE_ONLY.test(value)) return `${value}T00:00:00${VN_OFFSET}`;
  // "2026-11-12T17:00" or "2026-11-12T17:00:30"
  const withSeconds = /T\d{2}:\d{2}$/.test(value) ? `${value}:00` : value;
  return `${withSeconds}${VN_OFFSET}`;
}
