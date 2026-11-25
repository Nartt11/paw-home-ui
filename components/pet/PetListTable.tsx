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
import { clickableRowProps } from "@/components/common/admin/clickable-row";
import {
  PET_HEALTH_BADGE,
  PET_HEALTH_LABEL,
  PET_STATUS_BADGE,
  breedLabel,
  formatPetAge,
  petStatusLabel,
  speciesLabel,
} from "@/lib/pet-display";
import { STATUS_TONE_SOFT } from "@/lib/status-tone";
import type { PetHealthStatus } from "@/types/pet.type";
import type { PetSummary } from "@/types/pet.type";

export interface PetListTableProps {
  data: PetSummary[];
  loading?: boolean;
}

function petStatusBadge(status: PetSummary["status"]) {
  return (
    <Badge variant="outline" className={PET_STATUS_BADGE[status] ?? STATUS_TONE_SOFT.neutral}>
      {petStatusLabel(status)}
    </Badge>
  );
}

/** Same colours as the pet's own page: they come from one map. */
function petHealthStatusBadge(status: string) {
  return (
    <Badge variant="outline" className={PET_HEALTH_BADGE[status as PetHealthStatus] ?? STATUS_TONE_SOFT.neutral}>
      {PET_HEALTH_LABEL[status as PetHealthStatus] ?? status}
    </Badge>
  );
}

const columns: ColumnDef<PetSummary>[] = [
  {
    accessorKey: "name",
    header: "Thú cưng",
    cell: ({ row }) => (
      <div className="flex min-w-40 items-center gap-3">
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
    header: "Loài · giống",
    cell: ({ row }) => (
      <div className="text-slate-700">
        <div>{speciesLabel(row.original)}</div>
        <div className="text-xs text-slate-600">{breedLabel(row.original)}</div>
      </div>
    ),
  },
  {
    accessorKey: "age",
    header: "Tuổi",
    cell: ({ row }) => (
      <span className="whitespace-nowrap tabular-nums text-slate-700">
        {formatPetAge(row.original.age)}
      </span>
    ),
  },
  {
    accessorKey: "vaccinated",
    header: "Tiêm",
    cell: ({ row }) =>
      row.original.vaccinated ? (
        <Badge variant="outline" className={STATUS_TONE_SOFT.success}>
          Đã tiêm
        </Badge>
      ) : (
        <Badge variant="outline" className={STATUS_TONE_SOFT.neutral}>
          Chưa tiêm
        </Badge>
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
                  {...clickableRowProps(() => router.push(`/quan-ly-thu-cung/${row.original.petId}`))}
                  aria-label={`Mở hồ sơ ${row.original.name}`}
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
