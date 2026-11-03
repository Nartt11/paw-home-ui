"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
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
import { OrganizationSummary } from "@/types/organization.type";

export interface OrganizationListTableProps {
  data: OrganizationSummary[];
  loading?: boolean;
  keyword?: string;
  onViewDetail: (organizationId: string) => void;
  onEdit?: (organizationId: string) => void;
  onDelete?: (organizationId: string) => void;
}

function getStatusLabel(status?: string) {
  switch ((status ?? "").toUpperCase()) {
    case "ACTIVE":
      return {
        label: "Đang hoạt động",
        className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
      };
    case "INACTIVE":
      return {
        label: "Ngừng hoạt động",
        className: "bg-slate-100 text-slate-700 hover:bg-slate-100",
      };
    case "PENDING":
      return {
        label: "Chờ duyệt",
        className: "bg-amber-50 text-amber-700 hover:bg-amber-50",
      };
    default:
      return {
        label: status || "—",
        className: "bg-slate-100 text-slate-700 hover:bg-slate-100",
      };
  }
}

function getTypeLabel(type?: string) {
  switch (type) {
    case "SHELTER":
      return "Mái ấm";
    case "VET_CENTER":
      return "Cơ sở thú y";
    default:
      return type || "—";
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
      header: "Tổ chức",
      cell: ({ row }) => (
        <div className="min-w-56">
          <div className="truncate font-medium text-slate-900">
            {row.original.name || "(Chưa có tên)"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Loại",
      cell: ({ row }) => (
        <span className="text-slate-700">
          {getTypeLabel(row.original.type)}
        </span>
      ),
    },
    {
      id: "address",
      header: "Địa chỉ",
      cell: ({ row }) => (
        <div className="min-w-72 truncate text-slate-700">
          {[row.original.wardName, row.original.provinceName]
            .filter(Boolean)
            .join(", ") || "—"}
        </div>
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
        const id = row.original.organizationId;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <EllipsisVerticalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuItem onClick={() => onViewDetail(id)}>
                  Xem chi tiết
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onEdit?.(id)}>
                  Chỉnh sửa
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-rose-600 focus:text-rose-600"
                  onClick={() => onDelete?.(id)}
                >
                  Xóa
                </DropdownMenuItem>
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
  onEdit,
  onDelete,
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
                title="Chưa có tổ chức"
                description="Danh sách tổ chức sẽ hiển thị tại đây khi có dữ liệu."
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
