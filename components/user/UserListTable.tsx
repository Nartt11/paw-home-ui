"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";

import type { UserSummary } from "@/types/user.type";
import { clickableRowProps } from "@/components/common/admin/clickable-row";
import { userStatusBadge, userStatusLabel } from "@/lib/user-display";

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

function getColumns(
  props: Pick<UserListTableProps, "onToggleLock">,
): ColumnDef<UserSummary>[] {
  const { onToggleLock } = props;

  return [
    {
      accessorKey: "username",
      header: "Người dùng",
      cell: ({ row }) => (
        <div className="min-w-52">
          <div className="truncate font-medium text-foreground">
            {row.original.fullName?.trim() || row.original.username || "—"}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {row.original.username}
            {row.original.userCode ? ` · ${row.original.userCode}` : ""}
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
        return (
          <Badge variant="outline" className={userStatusBadge(row.original.status)}>
            {userStatusLabel(row.original.status)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        if (!onToggleLock) return null;
        const locked = row.original.status === "LOCKED";

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8" aria-label="Thao tác khác">
                  <EllipsisVerticalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuItem
                  variant={locked ? "default" : "destructive"}
                  onClick={() => onToggleLock(row.original)}
                >
                  {locked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
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
    () => getColumns({ onToggleLock }),
    [onToggleLock],
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
                <TableRow
                  key={row.id}
                  {...clickableRowProps(onViewDetail && (() => onViewDetail(row.original.userId)))}
                >
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
