import { APP_ROUTES } from "@/constants/routes";
import { RescueMapStat } from "@/types/public-page.type";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

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
    <section className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <Card>
          <CardContent>
            <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-400/60 bg-red-500/15 px-3 py-1 text-[11px] font-bold text-red-300">
                  <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-red-400" />
                  REALTIME · Đang cập nhật
                </div>
                <h2 className="mb-4 text-balance text-[26px] font-black leading-snug text-foreground md:text-[32px]">
                  Bản đồ cứu hộ
                  <br />
                  thực thời gian thực
                </h2>
                <p className="mb-7 max-w-lg text-[15px] leading-relaxed text-foreground/80">
                  Theo dõi các ca cứu hộ khẩn cấp, vị trí trung tâm quanh bạn
                </p>

                <div className="mb-8 flex flex-wrap gap-3">
                  {stats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl bg-foreground/10 px-4 py-2 text-center"
                    >
                      <div
                        className="text-[24px] font-black"
                        style={{ color: item.color }}
                      >
                        {item.val}
                      </div>
                      <div className="mt-0.5 text-[10px] text-foreground/70">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                <Link href={APP_ROUTES.MAP}>
                  <Button>
                    <MapPin size={18} />
                    Xem bản đồ cứu hộ
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>

              <div className="rounded-2xl border border-foreground/20 bg-foreground/10 p-4">
                <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-xl bg-slate-900">
                  <iframe
                    src="https://www.google.com/maps"
                    width="600"
                    height="400"
                    title="Mô tả trang web"
                    className="h-full w-full rounded-xl opacity-90"
                  ></iframe>

                
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
