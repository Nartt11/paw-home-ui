import * as React from "react";

import { cn } from "@/lib/utils";

interface SectionShellProps {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  align?: "left" | "center";
}

export function SectionShell({
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
  containerClassName,
  headerClassName,
  contentClassName,
  align = "left",
}: SectionShellProps) {
  const centered = align === "center";

  return (
    <section className={cn("px-6 py-12 md:py-16", className)}>
      <div className={cn("mx-auto max-w-7xl", containerClassName)}>
        {eyebrow || title || description || actions ? (
          <div
            className={cn(
              "mb-10",
              centered ? "mx-auto max-w-2xl text-center" : "",
              headerClassName,
            )}
          >
            {eyebrow}
            {title ? <div className="mt-4">{title}</div> : null}
            {description ? <div className="mt-3">{description}</div> : null}
            {actions ? <div className="mt-8">{actions}</div> : null}
          </div>
        ) : null}

        <div className={contentClassName}>{children}</div>
      </div>
    </section>
  );
}
