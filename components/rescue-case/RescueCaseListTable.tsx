"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { RescueCase } from "@/types/rescue.type";

export interface RescueCaseListTableProps {
  data: RescueCase[];
}

const columns: ColumnDef<RescueCase>[] = [
  {
    accessorKey: "id",
    header: "Mã ca cứu hộ",
    cell: ({ row }) => (
      <span className="font-medium text-slate-900">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "species",
    header: "Loài",
    cell: ({ row }) => (
      <span className="capitalize text-slate-700">
        {row.original.species ?? "Chưa rõ"}
      </span>
    ),
  },
  {
    accessorKey: "color",
    header: "Màu sắc",
    cell: ({ row }) => (
      <span className="text-slate-700">{row.original.color ?? "-"}</span>
    ),
  },
  {
    accessorKey: "size",
    header: "Kích thước",
    cell: ({ row }) => (
      <span className="text-slate-700">{row.original.size ?? "-"}</span>
    ),
  },
  {
    accessorKey: "location_text",
    header: "Địa điểm",
    cell: ({ row }) => (
      <span className="text-slate-700">
        {row.original.location_text ?? row.original.location ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "priority",
    header: "Mức độ ưu tiên",
    cell: ({ row }) => {
      const priority = row.original.priority ?? "NORMAL";

      const labelMap: Record<string, string> = {
        LOW: "Thấp",
        NORMAL: "Bình thường",
        HIGH: "Cao",
      };

      const colorClassMap: Record<string, string> = {
        LOW: "bg-sky-50 text-sky-700",
        NORMAL: "bg-amber-50 text-amber-700",
        HIGH: "bg-rose-50 text-rose-700",
      };

      return (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            colorClassMap[priority] ?? "bg-slate-100 text-slate-600"
          }`}
        >
          {labelMap[priority] ?? priority}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status ?? "OPEN";

      const labelMap: Record<string, string> = {
        OPEN: "Mở",
        IN_PROGRESS: "Đang xử lý",
        RESOLVED: "Đã xử lý",
      };

      const colorClassMap: Record<string, string> = {
        OPEN: "bg-amber-50 text-amber-700",
        IN_PROGRESS: "bg-sky-50 text-sky-700",
        RESOLVED: "bg-emerald-50 text-emerald-700",
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
];

export function RescueCaseListTable({ data }: RescueCaseListTableProps) {
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
                Không có ca cứu hộ nào.
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
