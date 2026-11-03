const ADMINISTRATIVE_PREFIX =
  /^(thanh pho|tinh|phuong|xa|dac khu|thi tran|thi xa|quan|huyen)\s+/;

// Nominatim và /locations có thể ghi khác nhau về dấu và tiền tố hành chính
export function normalizeLocationName(name: string) {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim()
    .replace(ADMINISTRATIVE_PREFIX, "");
}

export function findLocationByName<T extends { name: string }>(
  items: T[],
  name: string,
): T | undefined {
  const target = normalizeLocationName(name);
  if (!target) return undefined;

  return items.find((item) => normalizeLocationName(item.name) === target);
}
