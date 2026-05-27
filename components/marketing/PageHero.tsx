import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface PageHeroProps {
  imageSrc: string;
  imageAlt: string;
  badge?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  imageClassName?: string;
  overlayClassName?: string;
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
  minHeightClassName?: string;
}

export function PageHero({
  imageSrc,
  imageAlt,
  badge,
  title,
  description,
  actions,
  children,
  imageClassName,
  overlayClassName,
  className,
  containerClassName,
  contentClassName,
  minHeightClassName = "min-h-[560px]",
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden min-h-[100dvh] bg-slate-950/50",
        minHeightClassName,
        className,
      )}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={1200}
          height={900}
          unoptimized
          // Sửa h-max-screen thành h-full, thêm object-cover
          className={cn(
            "h-full w-full object-cover object-center",
            imageClassName,
          )}
        />
        {/* Overlay */}
        <div className={cn("absolute inset-0", overlayClassName)} />
      </div>

      {/* Content */}
      <div
        className={cn("relative z-10 container mx-auto w-full px-6", containerClassName)}
      >
        <div className={cn("", contentClassName)}>
          {badge}
          <div className="mt-4">{title}</div>
          {description ? <div className="mt-4">{description}</div> : null}
          {children}
        </div>
      </div>
    </section>
  );
}
