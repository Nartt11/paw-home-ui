"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { CheckIcon, EllipsisVerticalIcon } from "lucide-react";

import {
  AdminTableEmptyRow,
  AdminTableSkeletonRows,
} from "@/components/common/admin/AdminTableState";
import { clickableRowProps } from "@/components/common/admin/clickable-row";
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
import {
  organizationStatusBadge,
  organizationStatusLabel,
  organizationTypeLabel,
} from "@/lib/organization-display";
import { OrganizationSummary } from "@/types/organization.type";

export interface OrganizationListTableProps {
  data: OrganizationSummary[];
  loading?: boolean;
  keyword?: string;
  onViewDetail: (organizationId: string) => void;
  /** Queue action on a pending row. */
  onApprove?: (organizationId: string) => void;
  onReject?: (organizationId: string) => void;
  onEdit?: (organizationId: string) => void;
  onDelete?: (organizationId: string) => void;
  onCreateAccount?: (organizationId: string) => void;
}

type Actions = Omit<OrganizationListTableProps, "data" | "loading" | "keyword" | "onViewDetail">;

function getColumns({ onApprove, onReject, onEdit, onDelete, onCreateAccount }: Actions): ColumnDef<OrganizationSummary>[] {
  return [
    {
      accessorKey: "name",
      header: "Tổ chức",
      cell: ({ row }) => (
        <div className="min-w-56">
          <div className="truncate font-medium text-foreground">
            {row.original.name || "(Chưa có tên)"}
          </div>
          {row.original.email ? (
            <div className="truncate text-xs text-muted-foreground">{row.original.email}</div>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Loại",
      cell: ({ row }) => <span>{organizationTypeLabel(row.original.type)}</span>,
    },
    {
      id: "address",
      header: "Địa chỉ",
      cell: ({ row }) => (
        <div className="min-w-56 truncate text-muted-foreground">
          {[row.original.wardName, row.original.provinceName].filter(Boolean).join(", ") || "—"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <Badge variant="outline" className={organizationStatusBadge(row.original.status)}>
          {organizationStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const id = row.original.organizationId;
        const pending = (row.original.status ?? "").toUpperCase() === "PENDING";
        const active = (row.original.status ?? "").toUpperCase() === "ACTIVE";

        return (
          <div className="flex items-center justify-end gap-1">
            {pending && onApprove ? (
              <Button size="sm" onClick={() => onApprove(id)}>
                <CheckIcon className="size-4" />
                Duyệt
              </Button>
            ) : null}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8" aria-label="Thao tác khác">
                  <EllipsisVerticalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="min-w-48">
                {/* the backend refuses edits while a registration waits for review */}
                {onEdit && !pending ? <DropdownMenuItem onClick={() => onEdit(id)}>Chỉnh sửa</DropdownMenuItem> : null}
                {onCreateAccount && active ? (
                  <DropdownMenuItem onClick={() => onCreateAccount(id)}>Tạo tài khoản cho trạm</DropdownMenuItem>
                ) : null}

                {((onEdit && !pending) || (onCreateAccount && active)) && ((pending && onReject) || (onDelete && active)) ? (
                  <DropdownMenuSeparator />
                ) : null}

                {pending && onReject ? (
                  <DropdownMenuItem variant="destructive" onClick={() => onReject(id)}>
                    Từ chối đăng ký
                  </DropdownMenuItem>
                ) : null}
                {onDelete && active ? (
                  <DropdownMenuItem variant="destructive" onClick={() => onDelete(id)}>
                    Ngừng hoạt động
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}

export function OrganizationListTable({
  data,
  loading = false,
  keyword = "",
  onViewDetail,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  onCreateAccount,
}: OrganizationListTableProps) {
  const filteredData = React.useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return data;

    return data.filter((item) =>
      [item.name, item.email, item.phone, item.provinceName].some((value) => value?.toLowerCase().includes(q)),
    );
  }, [data, keyword]);

  const columns = React.useMemo(
    () => getColumns({ onApprove, onReject, onEdit, onDelete, onCreateAccount }),
    [onApprove, onReject, onEdit, onDelete, onCreateAccount],
  );

  // TanStack Table uses function-returning APIs that React Compiler warns about.
  // eslint-disable-next-line react-hooks/incompatible-library
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
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                title="Không có trung tâm nào"
                description="Thử đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm."
                cellClassName="px-3 py-12"
              />
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} {...clickableRowProps(() => onViewDetail(row.original.organizationId))}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
