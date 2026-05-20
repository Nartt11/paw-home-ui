import { useEffect, useRef, useState } from "react";

import { MetricCard } from "@/components/marketing/MetricCard";
import { StatItemConfig } from "@/types/public-page.type";

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
    <MetricCard
      value={`${count.toLocaleString()}${config.suffix ?? ""}`}
      label={config.label}
      valueClassName="text-white text-[28px] font-black md:text-[34px]"
      labelClassName="text-white/70"
      style={{ color: config.color }}
    />
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
    <section className="bg-primary px-6 py-4">
      <div
        ref={ref}
        className="mx-auto grid max-w-7xl grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      >
        {stats.map((item) => (
          <StatItem key={item.label} config={item} started={visible} />
        ))}
      </div>
    </section>
  );
}
