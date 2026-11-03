"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  type ColumnDef,
  useReactTable,
} from "@tanstack/react-table";

import {
  AdminTableEmptyRow,
  AdminTableSkeletonRows,
} from "@/components/common/admin/AdminTableState";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PetSummary } from "@/types/pet.type";

export interface PetListTableProps {
  data: PetSummary[];
  loading?: boolean;
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
    UNAVAILABLE: {
      label: "Không khả dụng",
    },
  };

  const item = map[status] ?? { label: status };

  return item.className ? (
    <Badge className={item.className}>{item.label}</Badge>
  ) : (
    <Badge variant="secondary">{item.label}</Badge>
  );
}

function petHealthStatusBadge(status: string) {
  const map: Record<string, { label: string; className?: string }> = {
    HEALTHY: {
      label: "Khỏe mạnh",
      className: "bg-green-50 text-green-700 hover:bg-green-50",
    },
    UNDER_TREATMENT: {
      label: "Đang điều trị",
      className: "bg-red-50 text-red-700 hover:bg-red-50",
    },
    RECOVERING: {
      label: "Đang hồi phục",
      className: "bg-yellow-50 text-yellow-700 hover:bg-yellow-50",
    },
    SPECIAL_NEEDS: {
      label: "Chăm sóc đặc biệt",
      className: "bg-orange-50 text-orange-700 hover:bg-orange-50",
    },
  };

  const item = map[status] ?? { label: status };

  return item.className ? (
    <Badge className={item.className}>{item.label}</Badge>
  ) : (
    <Badge variant="secondary">{item.label}</Badge>
  );
}

const columns: ColumnDef<PetSummary>[] = [
  {
    accessorKey: "petCode",
    header: "Mã",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-slate-600">
        {row.original.petCode || "-"}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Thú cưng",
    cell: ({ row }) => (
      <div className="flex min-w-60 items-center gap-3">
        {row.original.imageUrl && (
          <div className="size-9 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
            <Image
              src={row.original.imageUrl}
              alt={row.original.name}
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0">
          <div className="truncate font-medium text-slate-900">
            {row.original.name || "-"}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "species",
    header: "Loại",
    cell: ({ row }) => (
      <span className="capitalize text-slate-700">
        {row.original.species || "-"}
      </span>
    ),
  },
  {
    accessorKey: "breed",
    header: "Giống",
    cell: ({ row }) => (
      <span className="text-slate-700">{row.original.breed || "-"}</span>
    ),
  },
  {
    accessorKey: "ageDisplay",
    header: "Tuổi",
    cell: ({ row }) => (
      <span className="text-slate-700">{row.original.ageDisplay || "-"}</span>
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
  {
    accessorKey: "healthStatus",
    header: "Sức khỏe",
    cell: ({ row }) =>
      row.original.healthStatus
        ? petHealthStatusBadge(row.original.healthStatus)
        : "-",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => petStatusBadge(row.original.status),
  },
  {
    accessorKey: "organization",
    header: "Trung tâm",
    cell: ({ row }) => (
      <div className="min-w-50 truncate text-slate-900">
        {row.original.organization?.name || "-"}
      </div>
    ),
  },
];

export function PetListTable({ data, loading = false }: PetListTableProps) {
  const router = useRouter();

  // TanStack Table uses function-returning APIs that React Compiler warns about.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
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
                title="Chưa có thú cưng"
                description="Danh sách thú cưng sẽ xuất hiện tại đây khi có dữ liệu."
                cellClassName="px-3 py-12"
              />
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() =>
                    router.push(`/quan-ly-thu-cung/${row.original.petId}`)
                  }
                  className="cursor-pointer hover:bg-muted/50"
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
