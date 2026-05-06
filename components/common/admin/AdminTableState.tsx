import type { ReactNode } from "react";

import { SearchXIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AdminTableSkeletonRowsProps {
  columnCount: number;
  rowCount?: number;
  cellClassName?: string;
  rowClassName?: string;
}

interface AdminTableEmptyRowProps {
  colSpan: number;
  title?: string;
  description?: string;
  icon?: ReactNode;
  cellClassName?: string;
}

export function AdminTableSkeletonRows({
  columnCount,
  rowCount = 5,
  cellClassName,
  rowClassName,
}: AdminTableSkeletonRowsProps) {
  return Array.from({ length: rowCount }, (_, rowIndex) => (
    <tr
      key={`admin-table-skeleton-${rowIndex}`}
      className={cn("border-b border-border last:border-0", rowClassName)}
    >
      {Array.from({ length: columnCount }, (_, columnIndex) => (
        <td
          key={`admin-table-skeleton-${rowIndex}-${columnIndex}`}
          className={cn("px-4 py-3 align-middle", cellClassName)}
        >
          <Skeleton
            className={cn(
              "h-4 rounded-full",
              columnIndex === 0 && "w-24",
              columnIndex === 1 && "w-40",
              columnIndex === 2 && "w-28",
              columnIndex > 2 && "w-20",
            )}
          />
        </td>
      ))}
    </tr>
  ));
}

export function AdminTableEmptyRow({
  colSpan,
  title = "Chưa có dữ liệu",
  description = "Dữ liệu sẽ hiển thị tại đây khi có kết quả phù hợp.",
  icon,
  cellClassName,
}: AdminTableEmptyRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} className={cn("px-4 py-12", cellClassName)}>
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full border bg-muted/40 text-muted-foreground">
            {icon ?? <SearchXIcon className="size-5" />}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </td>
    </tr>
  );
}
