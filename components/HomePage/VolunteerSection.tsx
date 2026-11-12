import { ArrowRight, Users } from "lucide-react";

import { PageHero } from "@/components/marketing/PageHero";
import { PrimaryCta } from "@/components/marketing/PrimaryCta";
import { APP_ROUTES } from "@/constants/routes";
import { getBannerHref } from "@/lib/banner";
import type { Banner } from "@/types/banner.type";

const VOL_IMG =
  "https://images.unsplash.com/photo-1770355519733-cbdd0389c9d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900";

interface VolunteerSectionProps {
  banner?: Banner;
}

export default function VolunteerSection({ banner }: VolunteerSectionProps) {
  const primaryHref = getBannerHref(banner, APP_ROUTES.ABOUT_US);

  return (
    <PageHero
      imageSrc={banner?.mediaUrl || VOL_IMG}
      imageAlt={banner?.title || "Tình nguyện viên"}
      className="px-6 py-16 md:py-20"
      minHeightClassName="min-h-0"
      overlayClassName="bg-gradient-to-br from-slate-950/90 to-sky-900/80"
      containerClassName="max-w-7xl"
      contentClassName="max-w-none text-center"
      badge={
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-400/15 px-4 py-1.5 text-[11px] font-bold text-emerald-300">
          <Users size={13} />
          180+ tình nguyện viên
        </div>
      }
      title={
        <h2 className="text-balance text-[28px] font-black text-white md:text-[40px]">
          {banner?.title || "Trở thành tình nguyện viên"}
        </h2>
      }
      description={
        <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-white/80">
          {banner?.subtitle || "Tham gia cứu hộ, vận chuyển, chăm sóc và tìm mái ấm cho thú cưng. Mỗi giờ của bạn tạo ra sự thay đổi thực sự."}
            
        </p>
      }
      actions={
        <PrimaryCta href={primaryHref} variant="mint" size="lg">
          <Users size={20} />
          {banner ? "Xem chi tiết" : "Đăng kí tình nguyện viên ngay"}
          <ArrowRight size={18} />
        </PrimaryCta>
      }
    >
      <div className="mb-10 mt-8 flex flex-wrap justify-center gap-3 text-[13px] text-white">
        {[
          "Hỗ trợ khan cap",
          "Vận chuyển thú cưng",
          "Chăm sóc thú cưng",
          "Tư vấn nhận nuôi",
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
