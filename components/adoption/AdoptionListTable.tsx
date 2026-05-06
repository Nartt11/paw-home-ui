"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";

import type { AdoptionSummary } from "@/types/adoption.type";

import {
  AdminTableEmptyRow,
  AdminTableSkeletonRows,
} from "@/components/common/admin/AdminTableState";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface AdoptionListTableProps {
  data: AdoptionSummary[];
  loading?: boolean;
  onViewDetail?: (applicationId: string) => void;
  onApprove?: (applicationId: string) => void;
  onReject?: (applicationId: string) => void;
}

function formatDateVi(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status?: string }) {
  const s = status ?? "PENDING";

  const labelMap: Record<string, string> = {
    PENDING: "Đang chờ",
    APPROVED: "Đã duyệt",
    REJECTED: "Từ chối",
    CANCELED: "Đã huỷ",
  };

  // Prefer design tokens via classes; keep minimal hard-coded hues.
  const classMap: Record<string, string> = {
    PENDING: "bg-muted text-foreground",
    APPROVED: "bg-secondary text-secondary-foreground",
    REJECTED: "bg-destructive/10 text-destructive",
    CANCELED: "bg-muted text-muted-foreground",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        classMap[s] ?? "bg-muted text-muted-foreground",
      ].join(" ")}
    >
      {labelMap[s] ?? s}
    </span>
  );
}

const columns: ColumnDef<AdoptionSummary>[] = [
  {
    accessorKey: "applicationId",
    header: "Mã đơn",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-foreground">
        {row.original.applicationId}
      </span>
    ),
  },
  {
    accessorKey: "petName",
    header: "Thú cưng",
    cell: ({ row }) => (
      <span className="truncate font-medium text-foreground">
        {row.original.petName || "—"}
      </span>
    ),
  },
  {
    accessorKey: "applicantUsername",
    header: "Người nộp đơn",
    cell: ({ row }) => (
      <span className="truncate text-foreground">
        {row.original.applicantUsername || "—"}
      </span>
    ),
  },
  {
    accessorKey: "experience",
    header: "Kinh nghiệm",
    cell: ({ row }) => (
      <span className="line-clamp-2 min-w-55 text-muted-foreground">
        {row.original.experience || "—"}
      </span>
    ),
  },
  {
    accessorKey: "liveCondition",
    header: "Điều kiện sống",
    cell: ({ row }) => (
      <span className="line-clamp-2 min-w-55 text-muted-foreground">
        {row.original.liveCondition || "—"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDateVi(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: () => null,
  },
];

export function AdoptionListTable({
  data,
  loading,
  onViewDetail,
  onApprove,
  onReject,
}: AdoptionListTableProps) {
  const columnsWithActions = React.useMemo<ColumnDef<AdoptionSummary>[]>(() => {
    return columns.map((c) => {
      if (c.id !== "actions") return c;

      return {
        ...c,
        cell: ({ row }) => {
          const id = row.original.applicationId;
          const status = row.original.status ?? "PENDING";
          const canDecide = status === "PENDING";

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

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => onApprove?.(id)}
                    disabled={!onApprove || !canDecide}
                  >
                    Duyệt
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onReject?.(id)}
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

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
              title="Chưa có đơn nhận nuôi"
              description="Các yêu cầu nhận nuôi phù hợp sẽ xuất hiện tại đây."
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
