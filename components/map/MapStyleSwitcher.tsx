"use client";

import { Check, Layers } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { MAP_STYLES, useMapStyle } from "./map-style";

/** Button in a map corner that switches the basemap of every map on the site. */
export function MapStyleSwitcher({ className }: { className?: string }) {
  const [style, setStyle] = useMapStyle();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Đổi kiểu bản đồ, đang dùng ${style.label}`}
          title="Đổi kiểu bản đồ"
          className={cn(
            "flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white/95 px-3 text-sm font-medium text-slate-800 shadow-md backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            className,
          )}
        >
          <Layers className="size-4" aria-hidden />
          <span>{style.label}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Kiểu bản đồ</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MAP_STYLES.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onSelect={() => setStyle(option.id)}
            className="flex items-start gap-2"
          >
            <Check
              aria-hidden
              className={cn("mt-0.5 size-4 shrink-0", option.id === style.id ? "opacity-100" : "opacity-0")}
            />
            <span className="flex flex-col">
              <span className="font-medium">{option.label}</span>
              <span className="text-xs text-muted-foreground">{option.description}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
