"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { AdoptionApplication } from "@/types/adoption.type";

export interface AdoptionListTableProps {
  data: AdoptionApplication[];
}

const columns: ColumnDef<AdoptionApplication>[] = [
  {
    accessorKey: "id",
    header: "Mã đơn",
    cell: ({ row }) => (
      <span className="font-medium text-slate-900">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "pet_id",
    header: "Mã thú cưng",
    cell: ({ row }) => (
      <span className="text-slate-700">{row.original.pet_id ?? "-"}</span>
    ),
  },
  {
    accessorKey: "applicant_id",
    header: "Người nộp đơn",
    cell: ({ row }) => (
      <span className="text-slate-700">{row.original.applicant_id ?? "-"}</span>
    ),
  },
  {
    accessorKey: "organization_id",
    header: "Tổ chức",
    cell: ({ row }) => (
      <span className="text-slate-700">
        {row.original.organization_id ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status ?? "PENDING";

      const labelMap: Record<string, string> = {
        PENDING: "Đang chờ",
        APPROVED: "Đã duyệt",
        REJECTED: "Từ chối",
      };

      const colorClassMap: Record<string, string> = {
        PENDING: "bg-amber-50 text-amber-700",
        APPROVED: "bg-emerald-50 text-emerald-700",
        REJECTED: "bg-rose-50 text-rose-700",
      };

      return (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            colorClassMap[status] ?? "bg-slate-100 text-slate-600"
          }`}
        >
          {labelMap[status] ?? status}
        </span>
      );
    },
  },
  {
    accessorKey: "decided_at",
    header: "Ngày quyết định",
    cell: ({ row }) => {
      const decidedAt = row.original.decided_at;
      if (!decidedAt) return <span className="text-slate-400">Chưa có</span>;

      const date = decidedAt instanceof Date ? decidedAt : new Date(decidedAt);

      return (
        <span className="text-slate-700">
          {date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      );
    },
  },
];

export function AdoptionListTable({ data }: AdoptionListTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-slate-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-slate-200">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
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
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-4 text-center text-sm text-slate-500"
              >
                Không có đơn nhận nuôi nào.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2 align-middle">
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
