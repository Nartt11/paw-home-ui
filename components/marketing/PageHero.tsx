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
        "relative flex items-center overflow-hidden",
        minHeightClassName,
        className,
      )}
    >
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={1600}
          height={900}
          unoptimized
          className={cn("h-full w-full object-cover", imageClassName)}
        />
        <div className={cn("absolute inset-0", overlayClassName)} />
      </div>

      <div className={cn("relative z-10 mx-auto w-full px-6", containerClassName)}>
        <div className={cn("max-w-2xl", contentClassName)}>
          {badge}
          <div className="mt-4">{title}</div>
          {description ? <div className="mt-4">{description}</div> : null}
          {children}
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}
