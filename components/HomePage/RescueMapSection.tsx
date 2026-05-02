import { RescueMapStat } from "@/types/public-page.type";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

interface RescueMapSectionProps {
  stats: RescueMapStat[];
}

export default function RescueMapSection({ stats }: RescueMapSectionProps) {
  type PinConfig = {
    key: string;
    top: string;
    left: string;
    color: string;
    emoji: string;
  };

  const pins: PinConfig[] = [
    { key: "25-45", top: "25%", left: "45%", color: "#FF584F", emoji: "🆘" },
    { key: "55-65", top: "55%", left: "65%", color: "#FF584F", emoji: "🆘" },
    { key: "40-25", top: "40%", left: "25%", color: "#03354F", emoji: "🏥" },
    { key: "15-70", top: "15%", left: "70%", color: "#03354F", emoji: "🏥" },
    { key: "70-40", top: "70%", left: "40%", color: "#F7C400", emoji: "🎪" },
  ];

  return (
    <section className="bg-slate-50 px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[28px] bg-linear-to-r from-[#03354F] to-[#064a70] px-6 py-10 md:px-10 md:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.75)_1px,transparent_1px)] opacity-5 [background-size:32px_32px]" />

          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-400/60 bg-red-500/15 px-3 py-1 text-[11px] font-bold text-red-300">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-red-400" />
                REALTIME · Đang cập nhật
              </div>
              <h2 className="mb-4 text-balance text-[26px] font-black leading-snug text-white md:text-[32px]">
                Bản đồ cứu hộ
                <br />
                thực thời gian thực
              </h2>
              <p className="mb-7 max-w-lg text-[15px] leading-relaxed text-white/80">
                Theo dõi các ca cứu hộ khẩn cấp, vị trí trung tâm và sự kiện
                nhận nuôi trên bản đồ tương tác của Hà Nội.
              </p>

              <div className="mb-8 flex flex-wrap gap-3">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-white/10 px-4 py-2 text-center"
                  >
                    <div
                      className="text-[24px] font-black"
                      style={{ color: item.color }}
                    >
                      {item.val}
                    </div>
                    <div className="mt-0.5 text-[10px] text-white/70">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/rescues/map"
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#FF584F] to-[#FF9132] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(255,88,79,0.4)]"
              >
                <MapPin size={18} />
                Xem bản đồ cứu hộ
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-xl bg-slate-900">
                <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)]; [background-size:40px_40px]" />

                {pins.map((pin) => (
                  <div
                    key={pin.key}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ top: pin.top, left: pin.left }}
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[15px] shadow-lg"
                      style={{
                        backgroundColor: pin.color,
                        boxShadow: `0 4px 12px ${pin.color}66`,
                      }}
                    >
                      {pin.emoji}
                    </div>
                  </div>
                ))}

                <Link
                  href="/map"
                  className="relative rounded-xl border border-white/30 bg-slate-900/70 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-md"
                >
                  Mở bản đồ đầy đủ →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
