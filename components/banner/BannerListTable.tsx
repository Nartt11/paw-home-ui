"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from "lucide-react";

import type { Banner } from "@/types/banner.type";

import {
  AdminTableEmptyRow,
  AdminTableSkeletonRows,
} from "@/components/common/admin/AdminTableState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface BannerListTableProps {
  data: Banner[];
  loading?: boolean;
  page: number; // 1-based
  size: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onViewDetail?: (bannerId: string) => void;
  onEdit?: (bannerId: string) => void;
  onToggleActive?: (bannerId: string) => void;
  onDelete?: (bannerId: string) => void;
}

function formatDateVi(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
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

const columns: ColumnDef<Banner>[] = [
  {
    accessorKey: "bannerId",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.bannerId}</span>
    ),
  },
  {
    accessorKey: "title",
    header: "Tiêu đề",
    cell: ({ row }) => (
      <div className="min-w-55">
        <div className="truncate font-medium text-foreground">
          {row.original.title || "—"}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {row.original.subtitle || ""}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "targetPage",
    header: "Trang",
    cell: ({ row }) => (
      <Badge variant="secondary" className="rounded-full">
        {row.original.targetPage || "—"}
      </Badge>
    ),
  },
  {
    accessorKey: "displayOrder",
    header: "Thứ tự",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.displayOrder}</span>
    ),
  },
  {
    accessorKey: "active",
    header: "Hiển thị",
    cell: ({ row }) =>
      row.original.active ? (
        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
          Đang bật
        </Badge>
      ) : (
        <Badge variant="secondary">Tắt</Badge>
      ),
  },
  {
    accessorKey: "startDate",
    header: "Bắt đầu",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDateVi(row.original.startDate)}
      </span>
    ),
  },
  {
    accessorKey: "endDate",
    header: "Kết thúc",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDateVi(row.original.endDate)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: () => null,
  },
];

export function BannerListTable({
  data,
  loading,
  page,
  size,
  totalPages,
  totalElements,
  onPageChange,
  onSizeChange,
  onViewDetail,
  onEdit,
  onToggleActive,
  onDelete,
}: BannerListTableProps) {
  const columnsWithActions = React.useMemo<ColumnDef<Banner>[]>(() => {
    return columns.map((c) => {
      if (c.id !== "actions") return c;

      return {
        ...c,
        cell: ({ row }) => {
          const id = row.original.bannerId;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-44">
                  <DropdownMenuItem
                    onClick={() => onViewDetail?.(id)}
                    disabled={!onViewDetail}
                  >
                    Xem chi tiết
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onEdit?.(id)}
                    disabled={!onEdit}
                  >
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onToggleActive?.(id)}
                    disabled={!onToggleActive}
                  >
                    Bật/Tắt hiển thị
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete?.(id)}
                    disabled={!onDelete}
                  >
                    Xoá
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      } satisfies ColumnDef<Banner>;
    });
  }, [onDelete, onEdit, onToggleActive, onViewDetail]);

  const table = useReactTable({
    data,
    columns: columnsWithActions,
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
      <div className="w-full overflow-x-auto rounded-lg border border-border bg-card">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
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
                columnCount={columnsWithActions.length}
                rowCount={5}
                cellClassName="px-3 py-2 align-top"
                rowClassName="border-b border-border last:border-0"
              />
            ) : table.getRowModel().rows.length === 0 ? (
              <AdminTableEmptyRow
                colSpan={columnsWithActions.length}
                title="Chưa có banner"
                description="Banner mới sẽ xuất hiện tại đây sau khi được tạo."
                cellClassName="px-3 py-12"
              />
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 align-top">
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
        <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div>
              Tổng:{" "}
              <span className="font-medium text-foreground">
                {totalElements}
              </span>{" "}
              banner
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
                      className="px-2 text-sm text-muted-foreground"
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
