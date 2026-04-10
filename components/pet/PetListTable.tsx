"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import type { Pet } from "@/types/pet.type";

export interface PetListTableProps {
  data: Pet[];
}

const columns: ColumnDef<Pet>[] = [
  {
    accessorKey: "name",
    header: "Tên thú cưng",
    cell: ({ row }) => (
      <span className="font-medium text-slate-900">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "species",
    header: "Loài",
    cell: ({ row }) => {
      const species = (row.original as Pet & { species?: string }).species;
      if (!species) return null;

      return (
        <span className="capitalize text-slate-700">
          {species === "dog" ? "Chó" : species === "cat" ? "Mèo" : species}
        </span>
      );
    },
  },
  {
    accessorKey: "gender",
    header: "Giới tính",
    cell: ({ row }) => (
      <span className="text-slate-700">
        {row.original.gender === "male"
          ? "Đực"
          : row.original.gender === "female"
            ? "Cái"
            : row.original.gender}
      </span>
    ),
  },
  {
    accessorKey: "age",
    header: "Tuổi",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      const isAvailable = status === "available";

      return (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            isAvailable
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {isAvailable ? "Sẵn sàng" : status}
        </span>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Khu vực",
  },
];

export function PetListTable({ data }: PetListTableProps) {
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
                Không có thú cưng nào.
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
