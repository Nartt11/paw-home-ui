"use client";


import { adoptionStatusBadge, adoptionStatusLabel } from "@/lib/adoption-display";
import * as React from "react";
import Image from "next/image";
import {
  flexRender,
  getCoreRowModel,
  type ColumnDef,
  useReactTable,
} from "@tanstack/react-table";
import { Check, EllipsisVerticalIcon } from "lucide-react";

import type { AdoptionSummary } from "@/types/adoption.type";

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

function statusBadge(status: AdoptionSummary["status"]) {
  return (
    <Badge variant="outline" className={adoptionStatusBadge(status)}>
      {adoptionStatusLabel(status)}
    </Badge>
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
    accessorKey: "applicantName",
    header: "Người nộp đơn",
    cell: ({ row }) => (
      <div className="min-w-44">
        <div className="truncate font-medium text-slate-900">
          {row.original.applicantName || row.original.applicantUsername || "-"}
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
    cell: ({ row }) => statusBadge(row.original.status),
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
          // A queue: the one decision people make most sits on the row; refusing waits in ⋮.
          const canDecide = row.original.status === "PENDING";
          if (!canDecide || (!onApprove && !onReject)) return null;

          return (
            <div className="flex items-center justify-end gap-1">
              {onApprove ? (
                <Button type="button" size="sm" onClick={() => onApprove(applicationId)}>
                  <Check className="size-4" />
                  Duyệt
                </Button>
              ) : null}
              {onReject ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8" aria-label="Thao tác khác">
                      <EllipsisVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem variant="destructive" onClick={() => onReject(applicationId)}>
                      Từ chối đơn
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
          );
        },
      } satisfies ColumnDef<AdoptionSummary>;
    });
  }, [onApprove, onReject]);

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
                  {...clickableRowProps(onViewDetail && (() => onViewDetail(row.original.applicationId)))}
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
