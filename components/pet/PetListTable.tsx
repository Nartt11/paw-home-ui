"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import type { PetSummary } from "@/types/pet.type";
import {
  AdminTableEmptyRow,
  AdminTableSkeletonRows,
} from "@/components/common/admin/AdminTableState";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Image from "next/image";

export interface PetListTableProps {
  data: PetSummary[];
  loading?: boolean;
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSizeChange?: (size: number) => void;
}

function petStatusBadge(status: PetSummary["status"]) {
  const map: Record<
    string,
    { label: string; className?: string; variant?: "secondary" }
  > = {
    UNOWNED: {
      label: "Chưa có chủ",
      className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
    },
    PENDING: {
      label: "Đang chờ",
      className: "bg-amber-50 text-amber-700 hover:bg-amber-50",
    },
    ADOPTED: {
      label: "Đã nhận nuôi",
      className: "bg-sky-50 text-sky-700 hover:bg-sky-50",
    },
    FOSTERED: {
      label: "Đang foster",
      className: "bg-violet-50 text-violet-700 hover:bg-violet-50",
    },
    UNAVAILABLE: { label: "Không khả dụng" },
  };

  const item = map[status] ?? { label: status };

  return item.className ? (
    <Badge className={item.className}>{item.label}</Badge>
  ) : (
    <Badge variant="secondary">{item.label}</Badge>
  );
}

function petHealthStatusBadge(status: string) {
  const map: Record<string, { label: string; className?: string }> = {
    HEALTHY: {
      label: "Khỏe mạnh",
      className: "bg-green-50 text-green-700 hover:bg-green-50",
    },
    ILL: {
      label: "Bệnh",
      className: "bg-red-50 text-red-700 hover:bg-red-50",
    },
    INJURED: {
      label: "Bị thương",
      className: "bg-orange-50 text-orange-700 hover:bg-orange-50",
    },
    RECOVERING: {
      label: "Đang phục hồi",
      className: "bg-yellow-50 text-yellow-700 hover:bg-yellow-50",
    },
  };

  const item = map[status] ?? { label: status };

  return item.className ? (
    <Badge className={item.className}>{item.label}</Badge>
  ) : (
    <Badge variant="secondary">{item.label}</Badge>
  );
}

const columns: ColumnDef<PetSummary>[] = [
  {
    accessorKey: "petCode",
    header: "Mã",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-slate-600">
        {row.original.petCode || "—"}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Thú cưng",
    cell: ({ row }) => (
      <div className="flex min-w-60 items-center gap-3">
        <div className="size-9 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
          <Image
            src={row.original.imageUrl}
            alt={row.original.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="truncate font-medium text-slate-900">
            {row.original.name || "—"}
          </div>         
        </div>
      </div>
    ),
  },
  {
    accessorKey: "species",
    header: "Loài",
    cell: ({ row }) => (
      <span className="capitalize text-slate-700">
        {row.original.species || "—"}
      </span>
    ),
  },
  {
    accessorKey: "breed",
    header: "Giống",
    cell: ({ row }) => (
      <span className="text-slate-700">{row.original.breed || "—"}</span>
    ),
  },
  {
    accessorKey: "ageDisplay",
    header: "Tuổi",
    cell: ({ row }) => (
      <span className="text-slate-700">{row.original.ageDisplay || "—"}</span>
    ),
  },
  {
    accessorKey: "vaccinated",
    header: "Tiêm",
    cell: ({ row }) =>
      row.original.vaccinated ? (
        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
          Đã tiêm
        </Badge>
      ) : (
        <Badge variant="secondary">Chưa tiêm</Badge>
      ),
  },
  {
    accessorKey: "healthStatus",
    header: "Sức khỏe",
    cell: ({ row }) =>
      row.original.healthStatus
        ? petHealthStatusBadge(row.original.healthStatus)
        : "—",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => petStatusBadge(row.original.status),
  },
  {
    accessorKey: "organization",
    header: "Trung tâm",
    cell: ({ row }) => (
      <div className="min-w-50">
        <div className="truncate text-slate-900">
          {row.original.organization?.name || "—"}
        </div>
        <div className="truncate font-mono text-xs text-slate-500">
          {row.original.organization?.organizationId || ""}
        </div>
      </div>
    ),
  },
  {
    id: "area",
    header: "Khu vực",
    cell: ({ row }) => (
      <span className="text-slate-700">
        {row.original.ward || "—"}
        {row.original.province ? `, ${row.original.province}` : ""}
      </span>
    ),
  },
];

function getPaginationItems(current: number, total: number, maxButtons = 5) {
  if (total <= 0) return [1] as const;
  if (total <= maxButtons)
    return Array.from({ length: total }, (_, index) => index + 1) as Array<
      number | "ellipsis"
    >;

  const items: Array<number | "ellipsis"> = [];
  const windowSize = Math.max(1, maxButtons - 2);
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

  for (let value = start; value <= end; value += 1) items.push(value);

  if (end < total - 1) items.push("ellipsis");
  items.push(total);

  return items;
}

export function PetListTable({
  data,
  loading = false,
  page = 1,
  size = 10,
  totalElements,
  totalPages,
  onPageChange,
  onSizeChange,
}: PetListTableProps) {
  const router = useRouter();

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
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <div>
          Tổng:{" "}
          {typeof totalElements === "number" ? totalElements : data.length} thú
          cưng
        </div>
      </div>

      <div className="w-full max-w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-sm">
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
                  title="Chưa có thú cưng"
                  description="Danh sách thú cưng sẽ xuất hiện tại đây khi có dữ liệu."
                  cellClassName="px-3 py-12"
                />
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() =>
                      router.push(`/quan-ly-thu-cung/${row.original.petId}`)
                    }
                    className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
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
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="hidden sm:inline">Hiển thị</span>
            <Select
              value={String(size)}
              onValueChange={(value) => onSizeChange?.(Number(value))}
            >
              <SelectTrigger className="h-8 w-22">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option} / trang
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!canPrev || loading}
              onClick={() => onPageChange?.(Math.max(1, page - 1))}
            >
              <ChevronLeftIcon className="mr-1 size-4" />
              Trước
            </Button>

            <div className="flex items-center gap-1">
              {paginationItems.map((item, index) => {
                if (item === "ellipsis") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-sm text-slate-400"
                      aria-hidden
                    >
                      …
                    </span>
                  );
                }

                const isActive = item === page;

                return (
                  <Button
                    key={item}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className="h-8 min-w-8 px-2"
                    disabled={loading || isActive}
                    onClick={() => onPageChange?.(item)}
                  >
                    {item}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={!canNext || loading}
              onClick={() => onPageChange?.(Math.min(safeTotalPages, page + 1))}
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
