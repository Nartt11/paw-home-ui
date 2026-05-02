import { ArrowRight, Link, Users } from "lucide-react";

const VOL_IMG =
  "https://images.unsplash.com/photo-1770355519733-cbdd0389c9d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900";

export default function VolunteerSection() {
  return (
    <section className="relative overflow-hidden px-6 py-16 md:py-20">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={VOL_IMG}
          alt="Tình nguyện viên"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 to-sky-900/80" />
      </div>

      <div className="relative mx-auto max-w-7xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-400/15 px-4 py-1.5 text-[11px] font-bold text-emerald-300">
          <Users size={13} />
          180+ TÌNH NGUYỆN VIÊN TẠI HÀ NỘI
        </div>
        <h2 className="mb-4 text-balance text-[28px] font-black text-white md:text-[40px]">
          Trở thành Tình nguyện viên HPA
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-[15px] leading-relaxed text-white/80">
          Tham gia cứu hộ, vận chuyển, chăm sóc và tìm mái ấm cho thú cưng. Mỗi
          giờ của bạn tạo ra sự thay đổi thực sự.
        </p>
        <div className="mb-10 flex flex-wrap justify-center gap-3 text-[13px] text-white">
          {[
            "🤝 Cứu hộ khẩn cấp",
            "🚗 Vận chuyển thú cưng",
            "📷 Ghi lại hành trình",
            "💬 Tư vấn nhận nuôi",
          ].map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 backdrop-blur-md"
            >
              {item}
            </span>
          ))}
        </div>
        <Link
          href="/about"
          className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-400 to-sky-400 px-9 py-4 text-[15px] font-semibold text-white shadow-[0_8px_28px_rgba(45,212,191,0.4)]"
        >
          <Users size={20} />
          Đăng ký TNV ngay
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
