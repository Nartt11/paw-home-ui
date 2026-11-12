"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import type { RescueCaseSummary } from "@/types/rescue-case.type";

import {
  AdminTableEmptyRow,
  AdminTableSkeletonRows,
} from "@/components/common/admin/AdminTableState";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseApiDate, VN_TIME_ZONE } from "@/lib/datetime";

export interface RescueCaseListTableProps {
  data: RescueCaseSummary[];
  loading?: boolean;
  page: number; // 1-based
  size: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
}

function formatDateTimeVi(value?: string) {
  if (!value) return "—";
  const d = parseApiDate(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", {
    timeZone: VN_TIME_ZONE,
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPaginationItems(current: number, total: number, maxButtons = 5) {
  if (total <= 0) return [1];
  if (total <= maxButtons)
    return Array.from({ length: total }, (_, i) => i + 1);

  const items: Array<number | "ellipsis"> = [];

  const windowSize = Math.max(1, maxButtons - 2); // reserve for first & last
  const half = Math.floor(windowSize / 2);

  let start = current - half;
  let end = current + (windowSize - half - 1);

  if (start < 2) {
    start = 2;
    end = start + windowSize - 1;
  }
  if (end > total - 1) {
    end = total - 1;
    start = end - windowSize + 1;
  }

  items.push(1);
  if (start > 2) items.push("ellipsis");

  for (let p = start; p <= end; p += 1) items.push(p);

  if (end < total - 1) items.push("ellipsis");
  items.push(total);

  return items;
}

const columns: ColumnDef<RescueCaseSummary>[] = [
  {
    accessorKey: "caseId",
    header: "Mã ca cứu hộ",
    cell: ({ row }) => (
      <span className="font-medium text-slate-900">{row.original.caseId}</span>
    ),
  },
  {
    accessorKey: "species",
    header: "Loài",
    cell: ({ row }) => (
      <span className="capitalize text-slate-700">
        {row.original.species ?? "Chưa rõ"}
      </span>
    ),
  },
  {
    accessorKey: "locationText",
    header: "Địa điểm",
    cell: ({ row }) => (
      <span className="text-slate-700">{row.original.locationText ?? "-"}</span>
    ),
  },
  {
    accessorKey: "reporterUsername",
    header: "Người báo cáo",
    cell: ({ row }) => (
      <span className="text-slate-700">
        {row.original.reporterUsername ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "priority",
    header: "Mức độ ưu tiên",
    cell: ({ row }) => {
      const priority = row.original.priority ?? "NORMAL";

      const labelMap: Record<string, string> = {
        LOW: "Thấp",
        NORMAL: "Bình thường",
        HIGH: "Cao",
        CRITICAL: "Khẩn cấp",
      };

      const colorClassMap: Record<string, string> = {
        LOW: "bg-sky-50 text-sky-700",
        NORMAL: "bg-amber-50 text-amber-700",
        HIGH: "bg-rose-50 text-rose-700",
        CRITICAL: "bg-red-50 text-red-700",
      };

      return (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            colorClassMap[priority] ?? "bg-slate-100 text-slate-600"
          }`}
        >
          {labelMap[priority] ?? priority}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status ?? "REPORTED";

      const labelMap: Record<string, string> = {
        REPORTED: "Đã báo cáo",
        IN_PROGRESS: "Đang xử lý",
        RESCUED: "Đã cứu",
        CLOSED: "Đã đóng",
      };

      const colorClassMap: Record<string, string> = {
        REPORTED: "bg-amber-50 text-amber-700",
        IN_PROGRESS: "bg-sky-50 text-sky-700",
        RESCUED: "bg-emerald-50 text-emerald-700",
        CLOSED: "bg-slate-100 text-slate-600",
      };

      return (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            colorClassMap[status] ?? "bg-slate-100 text-slate-600"
          }`}
        >
          {labelMap[status] ?? status}
        </span>
      );
    },
  },
  {
    accessorKey: "reportedAt",
    header: "Thời gian báo cáo",
    cell: ({ row }) => (
      <span className="text-slate-700">
        {formatDateTimeVi(row.original.reportedAt)}
      </span>
    ),
  },
];

export function RescueCaseListTable({
  data,
  loading,
  page,
  size,
  totalPages,
  totalElements,
  onPageChange,
  onSizeChange,
}: RescueCaseListTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const safeTotalPages = totalPages && totalPages > 0 ? totalPages : 1;
  const canPrev = page > 1;
  const canNext = page < safeTotalPages;
  const paginationItems = React.useMemo(
    () => getPaginationItems(page, safeTotalPages, 5),
    [page, safeTotalPages],
  );

  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-slate-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <AdminTableSkeletonRows
                columnCount={columns.length}
                rowCount={5}
                cellClassName="px-3 py-2 align-middle"
                rowClassName="border-b border-slate-100 last:border-0"
              />
            ) : table.getRowModel().rows.length === 0 ? (
              <AdminTableEmptyRow
                colSpan={columns.length}
                title="Chưa có ca cứu hộ"
                description="Các ca cứu hộ mới sẽ được hiển thị tại đây."
                cellClassName="px-3 py-12"
              />
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <div>
              Tổng:{" "}
              <span className="font-medium text-slate-900">
                {totalElements}
              </span>{" "}
              ca
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Hiển thị</span>
              <Select
                value={String(size)}
                onValueChange={(v) => onSizeChange(Number(v))}
              >
                <SelectTrigger className="h-8 w-22">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} / trang
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!canPrev || Boolean(loading)}
              onClick={() => onPageChange(Math.max(1, page - 1))}
            >
              <ChevronLeftIcon className="mr-1 size-4" />
              Trước
            </Button>

            <div className="flex items-center gap-1">
              {paginationItems.map((it, idx) => {
                if (it === "ellipsis") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-sm text-slate-500"
                      aria-hidden
                    >
                      …
                    </span>
                  );
                }

                const isActive = it === page;
                return (
                  <Button
                    key={it}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className="h-8 min-w-8 px-2"
                    disabled={Boolean(loading) || isActive}
                    onClick={() => onPageChange(it)}
                  >
                    {it}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={!canNext || Boolean(loading)}
              onClick={() => onPageChange(Math.min(safeTotalPages, page + 1))}
            >
              Sau
              <ChevronRightIcon className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
