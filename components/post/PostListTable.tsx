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

import type { Post } from "@/types/post.type";

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

export interface PostListTableProps {
  data: Post[];
  loading?: boolean;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onViewDetail?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

function formatDateTime(value?: string) {
  if (!value) return "Chua co";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getContentPreview(value?: string) {
  if (!value?.trim()) return "Khong co noi dung";
  return value.length > 120 ? `${value.slice(0, 120)}...` : value;
}

function getPaginationItems(current: number, total: number, maxButtons = 5) {
  if (total <= 0) return [1];
  if (total <= maxButtons) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

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

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < total - 1) items.push("ellipsis");
  items.push(total);

  return items;
}

const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "postId",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.postId || "—"}</span>
    ),
  },
  {
    accessorKey: "content",
    header: "Noi dung",
    cell: ({ row }) => (
      <div className="min-w-72">
        <div className="line-clamp-3 text-sm text-foreground">
          {getContentPreview(row.original.content)}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "authorUsername",
    header: "Tac gia",
    cell: ({ row }) =>
      row.original.authorUsername ? (
        <Badge variant="secondary" className="rounded-full">
          {row.original.authorUsername}
        </Badge>
      ) : (
        <span className="text-sm text-muted-foreground">
          {row.original.authorId}
        </span>
      ),
  },
  {
    accessorKey: "rescueCaseId",
    header: "Ca cuu tro",
    cell: ({ row }) =>
      row.original.rescueCaseId ? (
        <Badge variant="outline" className="rounded-full">
          {row.original.rescueCaseId}
        </Badge>
      ) : (
        <span className="text-sm text-muted-foreground">Chua lien ket</span>
      ),
  },
  {
    accessorKey: "stats",
    header: "Tuong tac",
    cell: ({ row }) => (
      <div className="space-y-1 text-sm text-muted-foreground">
        <div>{row.original.likeCount} luot thich</div>
        <div>{row.original.commentCount} binh luan</div>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngay tao",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDateTime(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: () => null,
  },
];

export function PostListTable({
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
  onDelete,
}: PostListTableProps) {
  const columnsWithActions = React.useMemo<ColumnDef<Post>[]>(() => {
    return columns.map((column) => {
      if (column.id !== "actions") return column;

      return {
        ...column,
        cell: ({ row }) => {
          const id = row.original.postId;

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
                    Xem chi tiet
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onEdit?.(id)}
                    disabled={!onEdit}
                  >
                    Chinh sua
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete?.(id)}
                    disabled={!onDelete}
                  >
                    Xoa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      } satisfies ColumnDef<Post>;
    });
  }, [onDelete, onEdit, onViewDetail]);

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    getCoreRowModel: getCoreRowModel(),
  });

  const safePage = page > 0 ? page : 1;
  const safeTotalPages = totalPages > 0 ? totalPages : 1;
  const canPrev = safePage > 1;
  const canNext = safePage < safeTotalPages;
  const paginationItems = React.useMemo(
    () => getPaginationItems(safePage, safeTotalPages, 5),
    [safePage, safeTotalPages],
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
                title="Chua co bai dang"
                description="Bai dang moi se xuat hien tai day sau khi duoc tao."
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

        <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div>
              Tong:{" "}
              <span className="font-medium text-foreground">
                {totalElements}
              </span>{" "}
              bai dang
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Hien thi</span>
              <Select
                value={String(size)}
                onValueChange={(value) => onSizeChange(Number(value))}
              >
                <SelectTrigger className="h-8 w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50].map((item) => (
                    <SelectItem key={item} value={String(item)}>
                      {item} / trang
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
              onClick={() => onPageChange(Math.max(1, safePage - 1))}
            >
              <ChevronLeftIcon className="mr-1 size-4" />
              Truoc
            </Button>

            <div className="flex items-center gap-1">
              {paginationItems.map((item, index) => {
                if (item === "ellipsis") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-sm text-muted-foreground"
                      aria-hidden
                    >
                      ...
                    </span>
                  );
                }

                const isActive = item === safePage;

                return (
                  <Button
                    key={item}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className="h-8 min-w-8 px-2"
                    disabled={Boolean(loading) || isActive}
                    onClick={() => onPageChange(item)}
                  >
                    {item}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={!canNext || Boolean(loading)}
              onClick={() => onPageChange(Math.min(safeTotalPages, safePage + 1))}
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
