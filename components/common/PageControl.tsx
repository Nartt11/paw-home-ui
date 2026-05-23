import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export function PageControls({
  page,
  pageSize,
  pageSizeOptions,
  totalPages,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Page {page} of {Math.max(totalPages, 1)}
          {typeof totalItems === "number"
            ? ` · ${totalItems.toLocaleString()} items`
            : ""}
        </span>
        {onPageSizeChange && pageSize ? (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Rows</span>
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="h-9 rounded-lg border border-border bg-background px-2 text-sm text-foreground outline-none transition-all hover:border-primary/20 focus:border-primary/35"
            >
              {(pageSizeOptions ?? [10, 20, 50, 100]).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <Button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          size="sm"
          type="button"
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4" />
          Trước
        </Button>
        <Button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          size="sm"
          type="button"
          variant="outline"
        >
          Sau
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
