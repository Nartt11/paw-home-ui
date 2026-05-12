import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const marketingCardVariants = cva("rounded-3xl border shadow-sm", {
  variants: {
    variant: {
      default: "bg-white ring-1 ring-slate-200",
      soft: "border-transparent bg-slate-50 shadow-none ring-0",
      dark: "border-transparent bg-linear-to-br from-slate-900 to-slate-800 text-white ring-0",
      tinted: "border-amber-300/80 bg-linear-to-br from-[#FFF4EC] to-[#FFFCE0]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface MarketingCardProps
  extends React.ComponentProps<typeof Card>,
    VariantProps<typeof marketingCardVariants> {}

export function MarketingCard({
  className,
  variant,
  ...props
}: MarketingCardProps) {
  return (
    <Card
      className={cn(marketingCardVariants({ variant }), className)}
      {...props}
    />
  );
}
