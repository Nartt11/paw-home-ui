"use client";

import Link from "next/link";

const HERO_IMG =
  "https://images.unsplash.com/photo-1638552758613-0a9a70102bdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex font-[Montserrat]">
      {/* LEFT */}
      <div className="hidden md:flex flex-1 relative flex-col justify-end">
        <img
          src={HERO_IMG}
          className="absolute inset-0 w-full h-full object-cover object-center"
          alt=""
        />

        <div className="absolute inset-0 bg-gradient-to-br from-[#02171F]/90 via-[#03354F]/80 to-[#02171F]/70" />

        <div className="relative p-12 z-10">
          <Link href="/web" className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-[#FF9132] to-[#FF584F]">
              🐾
            </div>
            <div>
              <div className="text-white font-extrabold text-lg">PawHome</div>
              <div className="text-white/60 text-[10px] tracking-widest">
                CỨU HỘ · NHẬN NUÔI · YÊU THƯƠNG
              </div>
            </div>
          </Link>

          <h1 className="text-white font-black text-[clamp(28px,3vw,42px)] leading-tight max-w-[420px] mb-4">
            Tham gia cộng đồng <br />
            <span className="bg-gradient-to-r from-[#FF9132] to-[#F7DB47] bg-clip-text text-transparent">
              yêu thú cưng Hà Nội
            </span>
          </h1>

          <p className="text-white/70 text-sm max-w-[380px]">
            Hơn 1.200 thành viên đang cùng nhau cứu hộ và nhận nuôi mỗi ngày.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-[480px] max-w-md bg-white flex flex-col justify-center overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
