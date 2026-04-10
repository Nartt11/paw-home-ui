import { StatItemConfig } from "@/types/public-page.type";
import { useEffect, useRef, useState } from "react";

interface StatItemProps {
  config: StatItemConfig;
  started: boolean;
}

interface StatsSectionProps {
  stats: StatItemConfig[];
}

function useCounter(target: number, duration = 1800, start = false): number {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!start) return;

    let frame = 0;
    const total = Math.ceil(duration / 16);
    const step = target / total;

    const timer = setInterval(() => {
      frame += 1;
      setVal(Math.min(Math.round(step * frame), target));
      if (frame >= total) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [start, target, duration]);

  return val;
}

function StatItem({ config, started }: StatItemProps) {
  const count = useCounter(config.value, 1600, started);

  return (
    <div className="px-2 text-center">
      <div
        className="font-black leading-none"
        style={{
          fontSize: "clamp(32px, 5vw, 52px)",
          color: config.color,
        }}
      >
        {count.toLocaleString()}
        {config.suffix ?? ""}
      </div>
      <div className="mt-1 text-[13px] font-medium text-white/70">
        {config.label}
      </div>
    </div>
  );
}
export default function StatsSection({ stats }: StatsSectionProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-linear-to-r from-[#03354F] to-[#064a70] px-6 py-12">
      <div
        ref={ref}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      >
        {stats.map((item) => (
          <StatItem key={item.label} config={item} started={visible} />
        ))}
      </div>
    </section>
  );
}
