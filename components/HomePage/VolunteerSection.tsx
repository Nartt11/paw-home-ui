import { ArrowRight, Users } from "lucide-react";

import { PageHero } from "@/components/marketing/PageHero";
import { PrimaryCta } from "@/components/marketing/PrimaryCta";

const VOL_IMG =
  "https://images.unsplash.com/photo-1770355519733-cbdd0389c9d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900";

export default function VolunteerSection() {
  return (
    <PageHero
      imageSrc={VOL_IMG}
      imageAlt="TÃ¬nh nguyá»‡n viÃªn"
      className="px-6 py-16 md:py-20"
      minHeightClassName="min-h-0"
      overlayClassName="bg-gradient-to-br from-slate-950/90 to-sky-900/80"
      containerClassName="max-w-7xl"
      contentClassName="max-w-none text-center"
      badge={
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-400/15 px-4 py-1.5 text-[11px] font-bold text-emerald-300">
          <Users size={13} />
          180+ TÃŒNH NGUYá»†N VIÃŠN Táº I HÃ€ Ná»˜I
        </div>
      }
      title={
        <h2 className="text-balance text-[28px] font-black text-white md:text-[40px]">
          Trá»Ÿ thÃ nh TÃ¬nh nguyá»‡n viÃªn HPA
        </h2>
      }
      description={
        <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-white/80">
          Tham gia cá»©u há»™, váº­n chuyá»ƒn, chÄƒm sÃ³c vÃ  tÃ¬m mÃ¡i áº¥m cho thÃº cÆ°ng. Má»—i
          giá» cá»§a báº¡n táº¡o ra sá»± thay Ä‘á»•i thá»±c sá»±.
        </p>
      }
      actions={
        <PrimaryCta href="/about" variant="mint" size="lg">
          <Users size={20} />
          ÄÄƒng kÃ½ TNV ngay
          <ArrowRight size={18} />
        </PrimaryCta>
      }
    >
      <div className="mb-10 mt-8 flex flex-wrap justify-center gap-3 text-[13px] text-white">
        {[
          "ðŸ¤ Cá»©u há»™ kháº©n cáº¥p",
          "ðŸš— Váº­n chuyá»ƒn thÃº cÆ°ng",
          "ðŸ“· Ghi láº¡i hÃ nh trÃ¬nh",
          "ðŸ’¬ TÆ° váº¥n nháº­n nuÃ´i",
        ].map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 backdrop-blur-md"
          >
            {item}
          </span>
        ))}
      </div>
    </PageHero>
  );
}
