"use client";

import * as React from "react";
import Image from "next/image";
import {
  flexRender,
  getCoreRowModel,
  type ColumnDef,
  useReactTable,
} from "@tanstack/react-table";
import { Check, EllipsisVerticalIcon, X } from "lucide-react";

import type { AdoptionSummary } from "@/types/adoption.type";

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
import { parseApiDate, VN_TIME_ZONE } from "@/lib/datetime";

export interface AdoptionListTableProps {
  data: AdoptionSummary[];
  loading?: boolean;
  onViewDetail?: (applicationId: string) => void;
  onApprove?: (applicationId: string) => void;
  onReject?: (applicationId: string) => void;
}

function formatDateVi(value?: string) {
  if (!value) return "—";
  const d = parseApiDate(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("vi-VN", {
    timeZone: VN_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function adoptionStatusBadge(status: AdoptionSummary["status"]) {
  const map: Record<string, { label: string; className?: string }> = {
    PENDING: {
      label: "Chờ xét duyệt",
      className: "bg-amber-50 text-amber-700 hover:bg-amber-50",
    },
    APPROVED: {
      label: "Đã duyệt",
      className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
    },
    REJECTED: {
      label: "Từ chối",
      className: "bg-rose-50 text-rose-700 hover:bg-rose-50",
    },
    CANCELLED: {
      label: "Đã hủy",
      className: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    },
  };

  const item = map[status] ?? { label: status };

  return item.className ? (
    <Badge className={item.className}>{item.label}</Badge>
  ) : (
    <Badge variant="secondary">{item.label}</Badge>
  );
}

const columns: ColumnDef<AdoptionSummary>[] = [
  {
    accessorKey: "adoptionCode",
    header: "Mã đơn",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-slate-600">
        {row.original.adoptionCode || "-"}
      </span>
    ),
  },
  {
    accessorKey: "petName",
    header: "Thú cưng",
    cell: ({ row }) => (
      <div className="flex min-w-60 items-center gap-3">
        {row.original.petPrimaryImageUrl ? (
          <div className="size-10 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
            <Image
              src={row.original.petPrimaryImageUrl}
              alt={row.original.petName || "Pet image"}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex size-10 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
            PET
          </div>
        )}
        <div className="min-w-0">
          <div className="truncate font-medium text-slate-900">
            {row.original.petName || "-"}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "applicantUsername",
    header: "Người nộp đơn",
    cell: ({ row }) => (
      <div className="min-w-44">
        <div className="truncate font-medium text-slate-900">
          {row.original.applicantUsername || "-"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo đơn",
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">
        {formatDateVi(row.original.createdAt)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => adoptionStatusBadge(row.original.status),
  },
  {
    id: "actions",
    header: "",
    cell: () => null,
  },
];

export function AdoptionListTable({
  data,
  loading = false,
  onViewDetail,
  onApprove,
  onReject,
}: AdoptionListTableProps) {
  const columnsWithActions = React.useMemo<ColumnDef<AdoptionSummary>[]>(() => {
    return columns.map((column) => {
      if (column.id !== "actions") {
        return column;
      }

      return {
        ...column,
        cell: ({ row }) => {
          const applicationId = row.original.applicationId;
          const canDecide = row.original.status === "PENDING";

          return (
            <div
              className="flex items-center justify-end gap-2"
              onClick={(event) => event.stopPropagation()}
            >
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => onApprove?.(applicationId)}
                disabled={!onApprove || !canDecide}
              >
                <Check className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => onReject?.(applicationId)}
                disabled={!onReject || !canDecide}
              >
                <X className="size-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <EllipsisVerticalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onViewDetail?.(applicationId)}
                    disabled={!onViewDetail}
                  >
                    Xem chi tiết
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onApprove?.(applicationId)}
                    disabled={!onApprove || !canDecide}
                  >
                    Duyệt đơn
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onReject?.(applicationId)}
                    disabled={!onReject || !canDecide}
                  >
                    Từ chối
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      } satisfies ColumnDef<AdoptionSummary>;
    });
  }, [onApprove, onReject, onViewDetail]);

  // TanStack Table uses function-returning APIs that React Compiler warns about.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: columnsWithActions,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto max-w-full">
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
                cellClassName="px-3 py-2 align-middle"
                rowClassName="border-b last:border-0"
              />
            ) : table.getRowModel().rows.length === 0 ? (
              <AdminTableEmptyRow
                colSpan={columnsWithActions.length}
                title="Chưa có đơn nhận nuôi"
                description="Danh sách đơn nhận nuôi sẽ xuất hiện tại đây khi có dữ liệu."
                cellClassName="px-3 py-12"
              />
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onViewDetail?.(row.original.applicationId)}
                  className={onViewDetail ? "cursor-pointer hover:bg-muted/50" : ""}
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
