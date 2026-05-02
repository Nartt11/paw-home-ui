import { HowItWorksStep } from "@/types/public-page.type";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface HowItWorksSectionProps {
  steps: HowItWorksStep[];
}

export default function HowItWorksSection({ steps }: HowItWorksSectionProps) {
  return (
    <section className="bg-white px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-500">
            <CheckCircle2 size={13} />
            QUY TRÌNH ĐƠN GIẢN
          </div>
          <h2 className="mb-3 text-balance text-[26px] font-black text-slate-900 md:text-[34px]">
            Nhận nuôi thú cưng chỉ 4 bước
          </h2>
          <p className="mx-auto max-w-xl text-[15px] text-slate-600">
            Quy trình minh bạch, được HPA hướng dẫn tận tình từ đầu đến cuối.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <article
              key={step.step}
              className="relative overflow-hidden rounded-2xl bg-slate-50 px-6 py-7"
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
                BƯỚC {step.step}
              </div>
              <h3 className="mb-2 text-[18px] font-extrabold text-slate-900">
                {step.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-slate-600">
                {step.desc}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/pets"
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-br from-[#03354F] to-[#064a70] px-9 py-4 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(3,53,79,0.3)]"
          >
            🐾 Bắt đầu tìm thú cưng
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
