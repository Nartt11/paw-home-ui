"use client";
import {
  flexRender,
  getCoreRowModel,
  type ColumnDef,
  useReactTable,
} from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PostSummary } from "@/types/post.type";
import { parseApiDate, VN_TIME_ZONE } from "@/lib/datetime";

export interface PostListTableProps {
  data: PostSummary[];
  loading?: boolean;
  onViewDetail?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

function formatDate(value?: string) {
  if (!value) return "—";

  const parsed = parseApiDate(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("vi-VN", {
    timeZone: VN_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getContentPreview(value?: string) {
  if (!value?.trim()) return "Không có nội dung";
  return value.length > 120 ? `${value.slice(0, 120)}...` : value;
}

const columns: ColumnDef<PostSummary>[] = [
  {
    accessorKey: "content",
    header: "Bài đăng",
    cell: ({ row }) => (
      <div className="min-w-80 space-y-1">
        <div className="line-clamp-3 text-sm text-slate-900">
          {getContentPreview(row.original.content)}
        </div>
        <div className="text-xs text-slate-500">
          ID: {row.original.postId || "—"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "authorUsername",
    header: "Tác giả",
    cell: ({ row }) =>
      row.original.authorUsername ? (
        <Badge variant="secondary" className="rounded-full">
          {row.original.authorUsername}
        </Badge>
      ) : (
        <span className="text-sm text-muted-foreground">
          {row.original.authorId || "—"}
        </span>
      ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <div className="flex max-w-56 flex-wrap gap-1">
        {row.original.tags.length > 0 ? (
          row.original.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-full">
              {tag}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">Chưa có tag</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "stats",
    header: "Tương tác",
    cell: ({ row }) => (
      <div className="space-y-1 text-sm text-muted-foreground">
        <div>{row.original.likeCount} lượt thích</div>
        <div>{row.original.commentCount} bình luận</div>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.createdAt)}
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
  loading = false,
  onViewDetail,
  onEdit,
  onDelete,
}: PostListTableProps) {
  const columnsWithActions = columns.map((column) => {
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
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(id)} disabled={!onEdit}>
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete?.(id)}
                  disabled={!onDelete}
                >
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    } satisfies ColumnDef<PostSummary>;
  });

  // TanStack Table uses function-returning APIs that React Compiler warns about.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: columnsWithActions,
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
                columnCount={columnsWithActions.length}
                rowCount={5}
                cellClassName="px-3 py-2 align-top"
                rowClassName="border-b last:border-0"
              />
            ) : table.getRowModel().rows.length === 0 ? (
              <AdminTableEmptyRow
                colSpan={columnsWithActions.length}
                title="Chưa có bài đăng"
                description="Bài đăng mới sẽ xuất hiện tại đây sau khi được tạo."
                cellClassName="px-3 py-12"
              />
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/30">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-2 align-top">
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
