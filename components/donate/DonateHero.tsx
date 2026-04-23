import * as React from "react";

import type { DonateData } from "@/types/donate.type";

function toneToTextClass(tone: string | undefined) {
  switch (tone) {
    case "sun":
      return "text-yellow-300";
    case "emerald":
      return "text-emerald-300";
    case "orange":
      return "text-orange-300";
    case "sky":
      return "text-sky-300";
    default:
      return "text-primary-foreground";
  }
}

export function DonateHero({ data }: { data: DonateData["hero"] }) {
  return (
    <section className="bg-primary px-6 py-14 text-center text-primary-foreground md:py-20">
      <div className="mx-auto max-w-xl">
        <div className="text-6xl">💝</div>
        <h1 className="mt-4 whitespace-pre-line text-3xl font-black leading-tight md:text-5xl">
          {data.title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-primary-foreground/80 md:text-base">
          {data.description}
        </p>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {data.stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className={"text-2xl font-black " + toneToTextClass(s.tone)}>
                {s.value}
              </div>
              <div className="mt-1 text-[11px] text-primary-foreground/70">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
