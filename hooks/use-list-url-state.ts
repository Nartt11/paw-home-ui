"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SearchParamValue = string | number | boolean | null | undefined;

export type SearchParamPatch = Record<string, SearchParamValue>;

type UseListUrlStateOptions = {
  defaultPage?: number;
  defaultSize?: number;
};

export function parsePositiveInt(
  value: string | null,
  fallback: number,
): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function getOptionalSearchParam(value: string | null): string | undefined {
  if (value === null) return undefined;

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function useListUrlState(options: UseListUrlStateOptions = {}) {
  const { defaultPage = 0, defaultSize = 10 } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parsePositiveInt(searchParams.get("page"), defaultPage);
  const size = parsePositiveInt(searchParams.get("size"), defaultSize);

  const setParams = useCallback(
    (patch: SearchParamPatch) => {
      const next = new URLSearchParams(searchParams.toString());

      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          next.delete(key);
          return;
        }

        next.set(key, String(value));
      });

      const nextQueryString = next.toString();
      router.replace(nextQueryString ? `${pathname}?${nextQueryString}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      setParams({ page: nextPage });
    },
    [setParams],
  );

  const setSize = useCallback(
    (nextSize: number) => {
      setParams({ page: defaultPage, size: nextSize });
    },
    [defaultPage, setParams],
  );

  return {
    searchParams,
    page,
    size,
    setParams,
    setPage,
    setSize,
  };
}
