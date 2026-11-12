"use client";

import * as React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface BannerListTableProps {
  data: Banner[];
  loading?: boolean;
  onViewDetail?: (bannerId: string) => void;
  onEdit?: (bannerId: string) => void;
  onToggleActive?: (bannerId: string) => void;
  onDelete?: (bannerId: string) => void;
}

function formatDateVi(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const columnHelper = createColumnHelper<Banner>();

export function BannerListTable({
  data,
  loading = false,
  onViewDetail,
  onEdit,
  onToggleActive,
  onDelete,
}: BannerListTableProps) {
  const columns = React.useMemo(
    () => [
      columnHelper.display({
        id: "title",
        header: "Tiêu đề",
        cell: ({ row }) => (
          <div className="min-w-55">
            <div className="truncate font-medium text-slate-900">
              {row.original.title || "-"}
            </div>
            <div className="truncate text-xs text-slate-500">
              {row.original.subtitle || ""}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("targetPage", {
        header: "Trang",
        cell: ({ getValue }) => (
          <Badge variant="secondary" className="rounded-full">
            {getValue() || "-"}
          </Badge>
        ),
      }),
      columnHelper.accessor("displayOrder", {
        header: "Thứ tự",
        cell: ({ getValue }) => (
          <span className="font-mono text-xs text-slate-600">
            {getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "active",
        header: "Hiển thị",
        cell: ({ row }) => {
          const { active, bannerId } = row.original;

          return (
            <Switch
              checked={active}
              disabled={!onToggleActive}
              onCheckedChange={() => onToggleActive?.(bannerId)}
              aria-label={
                active ? "Tắt hiển thị banner" : "Bật hiển thị banner"
              }
            />
          );
        },
      }),
      columnHelper.accessor("startDate", {
        header: "Bắt đầu",
        cell: ({ getValue }) => (
          <span className="text-sm text-slate-700">
            {formatDateVi(getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("endDate", {
        header: "Kết thúc",
        cell: ({ getValue }) => (
          <span className="text-sm text-slate-700">
            {formatDateVi(getValue())}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const { active, bannerId } = row.original;

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
                    onClick={() => onViewDetail?.(bannerId)}
                    disabled={!onViewDetail}
                  >
                    Xem chi tiết
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onEdit?.(bannerId)}
                    disabled={!onEdit}
                  >
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onToggleActive?.(bannerId)}
                    disabled={!onToggleActive}
                  >
                    {active ? "Tắt hiển thị" : "Bật hiển thị"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete?.(bannerId)}
                    disabled={!onDelete}
                  >
                    Xóa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      }),
    ],
    [onDelete, onEdit, onToggleActive, onViewDetail],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <AdminTableSkeletonRows
                columnCount={columns.length}
                rowCount={5}
                cellClassName="px-3 py-2 align-middle"
                rowClassName="border-b last:border-0"
              />
            ) : table.getRowModel().rows.length === 0 ? (
              <AdminTableEmptyRow
                colSpan={columns.length}
                title="Chưa có banner"
                description="Banner mới sẽ xuất hiện tại đây sau khi được tạo."
                cellClassName="px-3 py-12"
              />
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
