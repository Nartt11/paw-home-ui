"use client";

import { Loader2 } from "lucide-react";

export function LoadingState({
  title = "Đang tải dữ liệu",
  message = "Vui lòng đợi một lát...",
}: {
  title?: string;
  message?: string;
} = {}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 p-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
