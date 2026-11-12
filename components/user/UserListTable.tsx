"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";

import type { UserSummary, UserStatus } from "@/types/user.type";

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

export interface UserListTableProps {
  data: UserSummary[];
  loading?: boolean;
  keyword?: string;

  onViewDetail?: (userId: string) => void;
  onToggleLock?: (user: UserSummary) => void;
}

function getStatusLabel(status?: UserStatus | string) {
  const s = status ?? "";
  switch (s) {
    case "ACTIVE":
      return {
        label: "Hoạt động",
        className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
      };
    case "LOCKED":
      return {
        label: "Đã khóa",
        className: "bg-rose-50 text-rose-700 hover:bg-rose-50",
      };
    case "BANNED":
      return {
        label: "Bị cấm",
        className: "bg-rose-50 text-rose-700 hover:bg-rose-50",
      };
    case "INACTIVE":
      return {
        label: "Ngừng hoạt động",
        className: "bg-slate-100 text-slate-700 hover:bg-slate-100",
      };
    case "PENDING_VERIFICATION":
      return {
        label: "Chờ xác minh",
        className: "bg-amber-50 text-amber-700 hover:bg-amber-50",
      };
    default:
      return {
        label: s || "Không rõ",
        className: "bg-slate-100 text-slate-700 hover:bg-slate-100",
      };
  }
}

function getColumns(
  props: Pick<UserListTableProps, "onViewDetail" | "onToggleLock">,
): ColumnDef<UserSummary>[] {
  const { onViewDetail, onToggleLock } = props;

  return [
    {
      accessorKey: "username",
      header: "Người dùng",
      cell: ({ row }) => (
        <div className="min-w-52">
          <div className="truncate font-medium text-slate-900">
            {row.original.username || "-"}
          </div>
          <div className="truncate font-mono text-xs text-slate-500">
            {row.original.userCode || row.original.userId}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="truncate text-slate-700">
          {row.original.email || "-"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = getStatusLabel(row.original.status);
        return (
          <Badge className={status.className} variant="secondary">
            {status.label}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const id = row.original.userId;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <EllipsisVerticalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuItem
                  onClick={() => onViewDetail?.(id)}
                  disabled={!onViewDetail}
                >
                  Xem chi tiết
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className={
                    row.original.status === "LOCKED"
                      ? undefined
                      : "text-rose-600 focus:text-rose-600"
                  }
                  onClick={() => onToggleLock?.(row.original)}
                  disabled={!onToggleLock}
                >
                  {row.original.status === "LOCKED"
                    ? "Mở khóa tài khoản"
                    : "Khóa tài khoản"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}

export function UserListTable({
  data,
  loading = false,
  keyword = "",
  onViewDetail,
  onToggleLock,
}: UserListTableProps) {
  const filteredData = React.useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return data;

    return data.filter((u) => {
      return (
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.userId?.toLowerCase().includes(q) ||
        u.userCode?.toLowerCase().includes(q)
      );
    });
  }, [data, keyword]);

  const columns = React.useMemo(
    () => getColumns({ onViewDetail, onToggleLock }),
    [onViewDetail, onToggleLock],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-hidden rounded-lg border">
      <div className="w-full overflow-x-auto">
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
                title="Chưa có người dùng"
                description="Danh sách người dùng sẽ hiển thị tại đây khi có dữ liệu."
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
