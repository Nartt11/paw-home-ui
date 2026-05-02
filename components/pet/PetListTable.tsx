"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import type { PetSummary } from "@/types/pet.type";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { EllipsisVerticalIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export interface PetListTableProps {
  data: PetSummary[];
}

function genderLabel(gender: PetSummary["gender"]) {
  switch (gender) {
    case "MALE":
      return "Đực";
    case "FEMALE":
      return "Cái";
    default:
      return "Không rõ";
  }
}

function petStatusBadge(status: PetSummary["status"]) {
  const map: Record<
    string,
    { label: string; className?: string; variant?: "secondary" }
  > = {
    UNOWNED: {
      label: "Chưa có chủ",
      className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
    },
    PENDING: {
      label: "Đang chờ",
      className: "bg-amber-50 text-amber-700 hover:bg-amber-50",
    },
    ADOPTED: {
      label: "Đã nhận nuôi",
      className: "bg-sky-50 text-sky-700 hover:bg-sky-50",
    },
    FOSTERED: {
      label: "Đang foster",
      className: "bg-violet-50 text-violet-700 hover:bg-violet-50",
    },
    UNAVAILABLE: { label: "Không khả dụng" },
  };

  const it = map[status] ?? { label: status };
  return it.className ? (
    <Badge className={it.className}>{it.label}</Badge>
  ) : (
    <Badge variant="secondary">{it.label}</Badge>
  );
}

function healthStatusBadge(status: PetSummary["healthStatus"]) {
  const map: Record<string, { label: string; className?: string }> = {
    HEALTHY: {
      label: "Khoẻ mạnh",
      className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
    },
    UNDER_TREATMENT: {
      label: "Đang điều trị",
      className: "bg-amber-50 text-amber-700 hover:bg-amber-50",
    },
    RECOVERING: {
      label: "Đang hồi phục",
      className: "bg-sky-50 text-sky-700 hover:bg-sky-50",
    },
    SPECIAL_NEEDS: {
      label: "Cần chăm sóc đặc biệt",
      className: "bg-rose-50 text-rose-700 hover:bg-rose-50",
    },
  };

  const it = map[status] ?? { label: status };
  return it.className ? (
    <Badge className={it.className}>{it.label}</Badge>
  ) : (
    <Badge variant="secondary">{it.label}</Badge>
  );
}

const columns: ColumnDef<PetSummary>[] = [
  {
    accessorKey: "petCode",
    header: "Mã",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-slate-600">
        {row.original.petCode || "—"}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Thú cưng",
    cell: ({ row }) => (
      <div className="flex min-w-60 items-center gap-3">
        <div className="size-9 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={row.original.imageUrl || "/file.svg"}
            alt={row.original.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="truncate font-medium text-slate-900">
            {row.original.name || "—"}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "species",
    header: "Loài",
    cell: ({ row }) => (
      <span className="capitalize text-slate-700">
        {row.original.species || "—"}
      </span>
    ),
  },
  {
    accessorKey: "breed",
    header: "Giống",
    cell: ({ row }) => (
      <span className="text-slate-700">{row.original.breed || "—"}</span>
    ),
  },
  // {
  //   accessorKey: "gender",
  //   header: "Giới tính",
  //   cell: ({ row }) => (
  //     <span className="text-slate-700">{genderLabel(row.original.gender)}</span>
  //   ),
  // },
  {
    accessorKey: "ageDisplay",
    header: "Tuổi",
    cell: ({ row }) => (
      <span className="text-slate-700">{row.original.ageDisplay || "—"}</span>
    ),
  },
  {
    accessorKey: "vaccinated",
    header: "Tiêm",
    cell: ({ row }) =>
      row.original.vaccinated ? (
        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
          Đã tiêm
        </Badge>
      ) : (
        <Badge variant="secondary">Chưa tiêm</Badge>
      ),
  },
  // {
  //   accessorKey: "healthStatus",
  //   header: "Sức khoẻ",
  //   cell: ({ row }) => healthStatusBadge(row.original.healthStatus),
  // },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => petStatusBadge(row.original.status),
  },
  {
    accessorKey: "organization",
    header: "Trung tâm",
    cell: ({ row }) => (
      <div className="min-w-50">
        <div className="truncate text-slate-900">
          {row.original.organization?.name || "—"}
        </div>
        <div className="truncate font-mono text-xs text-slate-500">
          {row.original.organization?.organizationId || ""}
        </div>
      </div>
    ),
  },
  {
    id: "area",
    header: "Khu vực",
    cell: ({ row }) => (
      <span className="text-slate-700">
        {row.original.ward || "—"}
        {row.original.province ? `, ${row.original.province}` : ""}
      </span>
    ),
  },
];

export function PetListTable({ data }: PetListTableProps) {
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full max-w-full rounded-lg border border-slate-200 bg-white">
      <table className="w-full table-fixed border-collapse text-sm">
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
                onClick={() =>
                  router.push(`/quan-ly-thu-cung/${row.original.petId}`)
                }
                className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
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
