import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const primaryCtaVariants = cva(
  "inline-flex items-center gap-2 rounded-xl text-sm font-semibold transition hover:opacity-95",
  {
    variants: {
      variant: {
        warm:
          "bg-linear-to-br from-orange-500 to-rose-500 text-white shadow-[0_8px_24px_rgba(255,145,50,0.35)]",
        ocean:
          "bg-linear-to-br from-[#03354F] to-[#064a70] text-white shadow-[0_8px_24px_rgba(3,53,79,0.3)]",
        mint:
          "bg-linear-to-br from-emerald-500 to-sky-500 text-white shadow-[0_8px_28px_rgba(45,212,191,0.28)]",
        glass: "border border-white/40 bg-white/10 text-white backdrop-blur-md",
      },
      size: {
        default: "px-7 py-3.5",
        lg: "px-9 py-4 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "warm",
      size: "default",
    },
  },
);

type BaseProps = VariantProps<typeof primaryCtaVariants> & {
  className?: string;
  children: React.ReactNode;
};

type PrimaryCtaLinkProps = BaseProps &
  Omit<React.ComponentProps<typeof Link>, "className" | "children">;

type PrimaryCtaButtonProps = BaseProps &
  Omit<React.ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

export function PrimaryCta(props: PrimaryCtaLinkProps | PrimaryCtaButtonProps) {
  if ("href" in props && props.href !== undefined) {
    const { variant, size, className, children, href, ...linkProps } = props;
    const classes = cn(primaryCtaVariants({ variant, size }), className);

    return (
      <Button asChild className={classes}>
        <Link href={href} {...linkProps}>
          {children}
        </Link>
      </Button>
    );
  }

  const { variant, size, className, children, ...buttonProps } = props;
  const classes = cn(primaryCtaVariants({ variant, size }), className);

  return (
    <Button className={classes} {...buttonProps}>
      {children}
    </Button>
  );
}
