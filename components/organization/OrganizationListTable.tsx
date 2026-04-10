"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import type { Organization } from "@/types/organization.type,";

export interface OrganizationListTableProps {
  data: Organization[];
}

const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: "name",
    header: "Tên tổ chức",
    cell: ({ row }) => (
      <span className="font-medium text-slate-900">
        {row.original.name ?? "(Chưa có tên)"}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Loại tổ chức",
    cell: ({ row }) => (
      <span className="capitalize text-slate-700">
        {row.original.type ?? "Khác"}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
    cell: ({ row }) => (
      <span className="text-slate-700">{row.original.phone ?? "-"}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-slate-700">{row.original.email ?? "-"}</span>
    ),
  },
  {
    accessorKey: "province_name",
    header: "Tỉnh / Thành phố",
    cell: ({ row }) => (
      <span className="text-slate-700">
        {row.original.province_name ?? row.original.location ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status ?? "unknown";
      const isActive = status === "active" || status === "approved";

      return (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            isActive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {isActive ? "Đang hoạt động" : status}
        </span>
      );
    },
  },
];

export function OrganizationListTable({ data }: OrganizationListTableProps) {
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
                Không có tổ chức nào.
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
