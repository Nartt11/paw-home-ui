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
  SearchIcon,
} from "lucide-react";

import {
  AdminTableEmptyRow,
  AdminTableSkeletonRows,
} from "@/components/common/admin/AdminTableState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import { OrganizationSummary } from "@/types/organization.type";

export interface OrganizationListTableProps {
  data: OrganizationSummary[];
  loading?: boolean;
  keyword?: string;
  onViewDetail: (organizationId: string) => void;
  onEdit?: (organizationId: string) => void;
  onDelete?: (organizationId: string) => void;

  // pagination (server-side)
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSizeChange?: (size: number) => void;
  onKeywordChange?: (keyword: string) => void;
}

function getStatusLabel(status?: string) {
  switch (status) {
    case "active":
    case "approved":
      return {
        label: "Đang hoạt động",
        className: "bg-emerald-50 text-emerald-600",
      };

    case "pending":
      return {
        label: "Chờ duyệt",
        className: "bg-amber-50 text-amber-600",
      };

    case "inactive":
      return {
        label: "Tạm dừng",
        className: "bg-slate-100 text-slate-600",
      };

    default:
      return {
        label: status || "Không xác định",
        className: "bg-slate-100 text-slate-600",
      };
  }
}

function getColumns(
  onViewDetail: (organizationId: string) => void,
  onEdit?: (organizationId: string) => void,
  onDelete?: (organizationId: string) => void,
): ColumnDef<OrganizationSummary>[] {
  return [
    {
      accessorKey: "name",
      header: "Tên tổ chức",
      cell: ({ row }) => (
        <div className="font-medium text-slate-900">
          {row.original.name || "(Chưa có tên)"}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Loại",
      cell: ({ row }) => (
        <span className="capitalize text-slate-700">
          {row.original.type || "-"}
        </span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Điện thoại",
      cell: ({ row }) => row.original.phone || "-",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email || "-",
    },
    {
      accessorKey: "provinceName",
      header: "Tỉnh / Thành phố",
      cell: ({ row }) => row.original.provinceName || "-",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = getStatusLabel(row.original.status);

        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${status.className}`}
          >
            {status.label}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const id = row.original.organizationId;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <EllipsisVerticalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onViewDetail(id)}>
                Xem chi tiết
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onEdit?.(id)}>
                Chỉnh sửa
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => onDelete?.(id)}
              >
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
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

export function OrganizationListTable({
  data,
  loading = false,
  keyword = "",
  onViewDetail,
  onEdit,
  onDelete,
  page = 1,
  size = 10,
  totalElements,
  totalPages,
  onPageChange,
  onSizeChange,
  onKeywordChange,
}: OrganizationListTableProps) {
  const filteredData = React.useMemo(() => {
    const q = keyword.trim().toLowerCase();

    if (!q) return data;

    return data.filter((item) => {
      return (
        item.name?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.phone?.toLowerCase().includes(q) ||
        item.provinceName?.toLowerCase().includes(q)
      );
    });
  }, [data, keyword]);

  const columns = React.useMemo(
    () => getColumns(onViewDetail, onEdit, onDelete),
    [onViewDetail, onEdit, onDelete],
  );

  const table = useReactTable({
    data: filteredData,
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
      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

          <Input
            placeholder="Tìm tổ chức..."
            value={keyword}
            onChange={(e) => onKeywordChange?.(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <div>
            Tổng:{" "}
            {typeof totalElements === "number" && !keyword.trim()
              ? totalElements
              : filteredData.length}{" "}
            tổ chức
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
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
                  cellClassName="whitespace-nowrap px-4 py-3 text-slate-700"
                  rowClassName="border-t border-slate-100"
                />
              ) : table.getRowModel().rows.length === 0 ? (
                <AdminTableEmptyRow
                  colSpan={columns.length}
                  title="Chưa có tổ chức"
                  description="Danh sách tổ chức sẽ hiển thị tại đây khi có dữ liệu."
                  cellClassName="px-4 py-12"
                />
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-slate-100 transition-colors hover:bg-slate-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap px-4 py-3 text-slate-700"
                      >
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

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="hidden sm:inline">Hiển thị</span>
            <Select
              value={String(size)}
              onValueChange={(v) => onSizeChange?.(Number(v))}
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
              {paginationItems.map((it, idx) => {
                if (it === "ellipsis") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-sm text-slate-400"
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
                    disabled={loading || isActive}
                    onClick={() => onPageChange?.(it)}
                  >
                    {it}
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
