import { ArrowRight, CheckCircle2 } from "lucide-react";

import { MarketingCard } from "@/components/marketing/MarketingCard";
import { PrimaryCta } from "@/components/marketing/PrimaryCta";
import { SectionShell } from "@/components/marketing/SectionShell";
import { APP_ROUTES } from "@/constants/routes";
import type { HowItWorksStep } from "@/types/public-page.type";

interface HowItWorksSectionProps {
  steps: HowItWorksStep[];
}

export default function HowItWorksSection({ steps }: HowItWorksSectionProps) {
  return (
    <SectionShell
      className="bg-white"
      align="center"
      eyebrow={
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-500">
          <CheckCircle2 size={13} />
          QUY TRINH DON GIAN
        </div>
      }
      title={
        <h2 className="text-balance text-[26px] font-black text-slate-900 md:text-[34px]">
          Nhan nuoi thu cung chi 4 buoc
        </h2>
      }
      description={
        <p className="mx-auto max-w-xl text-[15px] text-slate-600">
          Quy trinh minh bach, duoc HPA huong dan tan tinh tu dau den cuoi.
        </p>
      }
      actions={
        <PrimaryCta href={APP_ROUTES.ADOPTION} variant="ocean" size="lg">
          Bat dau tim thu cung
          <ArrowRight size={18} />
        </PrimaryCta>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <MarketingCard
            key={step.step}
            variant="soft"
            className="relative overflow-hidden rounded-2xl px-6 py-7"
          >
            <div
              className="pointer-events-none absolute -right-3 -top-2 text-7xl font-black leading-none opacity-5"
              style={{ color: step.color }}
            >
              {step.step}
            </div>
            <div
              className="mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-2xl text-[26px]"
              style={{ backgroundColor: `${step.color}18` }}
            >
              {step.icon}
            </div>
            <div
              className="mb-2 text-[10px] font-bold tracking-[0.2em]"
              style={{ color: step.color }}
            >
              BUOC {step.step}
            </div>
            <h3 className="mb-2 text-[18px] font-extrabold text-slate-900">
              {step.title}
            </h3>
            <p className="text-[13px] leading-relaxed text-slate-600">
              {step.desc}
            </p>
          </MarketingCard>
        ))}
      </div>
    </SectionShell>
  );
}
