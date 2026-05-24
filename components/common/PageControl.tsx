import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
  const resolvedPageSize = pageSize ?? pageSizeOptions?.[0] ?? 10;
  const resolvedPageSizeOptions =
    pageSizeOptions && pageSizeOptions.length > 0
      ? pageSizeOptions
      : [10, 20, 30, 40, 50];
  const safeTotalPages = Math.max(totalPages, 1);
  const safePageIndex = Math.min(Math.max(page, 0), safeTotalPages - 1);
  const displayPage = safePageIndex + 1;
  const canPreviousPage = safePageIndex > 0;
  const canNextPage = safePageIndex < safeTotalPages - 1;

  return (
    <div className="flex items-center justify-between px-4">
      <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
        Tổng số: {" "}
        {typeof totalItems === "number" ? `${totalItems} items` : null}
      </div>
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page
          </Label>
          <Select
            value={`${resolvedPageSize}`}
            onValueChange={(value) => {
              onPageSizeChange?.(Number(value));
            }}
            disabled={!onPageSizeChange}
          >
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue placeholder={resolvedPageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                {resolvedPageSizeOptions.map((option) => (
                  <SelectItem key={option} value={`${option}`}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          Page {displayPage} of {safeTotalPages}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(0)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => onPageChange(safePageIndex - 1)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => onPageChange(safePageIndex + 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => onPageChange(safeTotalPages - 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
