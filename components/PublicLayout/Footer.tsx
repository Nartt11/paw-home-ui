import Link from "next/link";
import { ChevronRight, MapPin, Phone, Mail, Smartphone } from "lucide-react";

const SOCIAL_ICONS = ["📘", "▶️", "📷"];

export default function Footer() {
  return (
    <footer className="bg-[#02171F] text-white pt-14">
      <div className="max-w-7xl mx-auto px-6 ">
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-11">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <div
                className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-[22px]
                              bg-gradient-to-br from-[#FF9132] to-[#FF584F]"
              >
                🐾
              </div>
              <div>
                <div className="text-[17px] font-extrabold">PawHome</div>
                <div className="text-[9px] tracking-[1.2px] text-white/50">
                  CỨU HỘ · NHẬN NUÔI · YÊU THƯƠNG
                </div>
              </div>
            </div>

            <p className="text-[13px] text-white/60 leading-relaxed mb-4">
              Tổ chức phi lợi nhuận chuyên cứu hộ, chăm sóc và kết nối thú cưng
              cần mái ấm tại Hà Nội từ năm 2018.
            </p>

            <div className="flex gap-2">
              {SOCIAL_ICONS.map((icon) => (
                <button
                  key={icon}
                  className="w-[34px] h-[34px] rounded-lg bg-white/10 flex items-center justify-center text-[15px]
                             hover:bg-white/20 transition"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[1px] text-ph-orange mb-3.5">
              Khám phá
            </h4>

            {[
              {
                label: "Nhận nuôi thú cưng",
                href: "/adoption",
              },
              { label: "Bản đồ cứu hộ", href: "/map" },
              {
                label: "Đăng ký TNV",
                href: "/volunteer",
              },
              {
                label: "Tin tức & Sự kiện",
                href: "/articles",
              },
              {
                label: "Cộng đồng PawHome",
                href: "/community",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 mb-2.5 group"
              >
                <ChevronRight
                  size={11}
                  className="text-ph-orange shrink-0 group-hover:translate-x-1 transition"
                />
                <Link
                  href={item.href}
                  className="text-[12px] text-white/60 hover:text-white transition"
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[1px] text-ph-orange mb-3.5">
              Liên hệ
            </h4>

            {[
              { Icon: MapPin, text: "15 Phố Duy Tân, Cầu Giấy, Hà Nội" },
              { Icon: Phone, text: "1800-HPA (miễn phí)" },
              { Icon: Mail, text: "admin@pawhome.vn" },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex gap-2.5 mb-2.5 items-start">
                <Icon size={13} className="text-ph-orange mt-0.5 shrink-0" />
                <span className="text-[12px] text-white/60 leading-relaxed">
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* APP */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[1px] text-ph-orange mb-3.5">
              Ứng dụng
            </h4>

            <p className="text-[12px] text-white/60 leading-relaxed mb-3.5">
              Tải app PawHome để theo dõi thú cưng, nhận thông báo cứu hộ và kết
              nối cộng đồng.
            </p>

            <Link
              href="/mobile-demo"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl
                         bg-white/10 border border-white/15
                         hover:bg-white/15 transition"
            >
              <Smartphone size={19} className="text-ph-orange" />
              <div>
                <div className="text-[9px] text-white/50">Xem demo</div>
                <div className="text-[12px] font-bold text-white">
                  PawHome Mobile App
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 py-4 flex flex-wrap justify-between items-center gap-2.5">
          <span className="text-[11px] text-white/40">
            © 2026 PawHome. Made with ❤️ for animals.
          </span>

          <div className="flex gap-4">
            {[
              { label: "Điều khoản", href: "/terms" },
              { label: "Bảo mật", href: "/privacy" },
              { label: "Cookie", href: "/cookie" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[11px] text-white/40 hover:text-white transition"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
