"use client";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        // Nếu đã đạt 99% thì dừng lại, không bao giờ tự nhảy lên 100%
        if (oldProgress >= 99) {
          clearInterval(timer);
          return 99;
        }

        // Tăng ngẫu nhiên: nếu đã vượt qua 80% thì tăng rất chậm (0-2%)
        // Nếu chưa tới 80% thì tăng nhanh hơn (0-15%)
        const increment =
          oldProgress > 80 ? Math.random() * 2 : Math.random() * 15;

        return Math.min(oldProgress + increment, 99);
      });
    }, 400); // Cứ 400ms thì cập nhật thanh tiến trình 1 lần

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex w-full max-w-xs flex-col items-center gap-6">
        {/* Vòng tròn xoay (tuỳ chọn giữ lại để tạo cảm giác hệ thống đang chạy) */}
        <svg
          className="h-10 w-10 animate-spin text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>

        {/* Khu vực Progress Bar */}
        <div className="w-full space-y-2">
          {/* Thanh chạy */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/50">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Text hiển thị trạng thái và phần trăm */}
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span className="animate-pulse">
              Đang kiểm tra phiên đăng nhập...
            </span>
            <span className="tabular-nums">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
