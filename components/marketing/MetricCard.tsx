import * as React from "react";

import { cn } from "@/lib/utils";

interface MetricCardProps extends React.ComponentProps<"div"> {
  value: string;
  label: string;
  valueClassName?: string;
  labelClassName?: string;
}

export function MetricCard({
  value,
  label,
  valueClassName,
  labelClassName,
  className,
  ...props
}: MetricCardProps) {
  return (
    <div className={cn("px-2 text-center", className)} {...props}>
      <div className={cn("font-black leading-none", valueClassName)}>{value}</div>
      <div className={cn("mt-1 text-[13px] font-medium", labelClassName)}>
        {label}
      </div>
    </div>
  );
}
