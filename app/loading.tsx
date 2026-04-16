"use client";

import { useEffect, useState } from "react";

const paws = [
  { x: "15%", y: "20%", rotate: -20, delay: "0s", size: 28 },
  { x: "78%", y: "12%", rotate: 15, delay: "0.3s", size: 20 },
  { x: "88%", y: "55%", rotate: 30, delay: "0.6s", size: 24 },
  { x: "8%", y: "70%", rotate: -10, delay: "0.9s", size: 22 },
  { x: "60%", y: "82%", rotate: 20, delay: "1.2s", size: 18 },
  { x: "35%", y: "90%", rotate: -25, delay: "0.5s", size: 16 },
  { x: "92%", y: "80%", rotate: 10, delay: "1.5s", size: 14 },
  { x: "5%", y: "35%", rotate: -15, delay: "1.8s", size: 20 },
];

const loadingMessages = [
  "Tìm những người bạn bốn chân đang chờ đợi...",
  "Kết nối những trái tim yêu thương...",
  "Chuẩn bị mái ấm cho các bé...",
  "Mỗi chú thú cưng đều xứng đáng được yêu thương...",
];

export default function PawHomeLoading() {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [fadeMsg, setFadeMsg] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cycle = setInterval(() => {
      setFadeMsg(false);

      setTimeout(() => {
        setMsgIndex((prev) => (prev + 1) % loadingMessages.length);
        setFadeMsg(true);
      }, 400);
    }, 2600);

    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#FDF6EE]">
      {/* Background Blobs */}
      <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,_#F6C89F_0%,_transparent_70%)] opacity-30" />
      <div className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,_#F4A07A_0%,_transparent_70%)] opacity-20" />
      <div className="absolute left-[30%] top-[60%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,_#FBBF8C_0%,_transparent_70%)] opacity-20" />

      {/* Floating Paws */}
      {paws.map((paw, index) => (
        <span
          key={index}
          className="absolute select-none animate-float-paw"
          style={{
            left: paw.x,
            top: paw.y,
            fontSize: `${paw.size}px`,
            animationDelay: paw.delay,
            transform: `rotate(${paw.rotate}deg)`,
          }}
        >
          🐾
        </span>
      ))}

      {/* Card */}
      <div className="relative z-10 flex w-[340px] flex-col items-center rounded-3xl bg-white/70 px-10 py-12 shadow-[0_8px_48px_rgba(220,140,80,0.13)] backdrop-blur-md">
        {/* Logo */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#F6A96C] to-[#F07A3A] shadow-inner">
          <svg
            viewBox="0 0 64 64"
            className="h-10 w-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="32"
              cy="42"
              rx="12"
              ry="10"
              fill="white"
              opacity="0.95"
            />
            <ellipse cx="32" cy="42" rx="7" ry="6" fill="white" opacity="0.6" />
            <ellipse cx="20" cy="30" rx="5" ry="6" fill="white" opacity="0.9" />
            <ellipse cx="44" cy="30" rx="5" ry="6" fill="white" opacity="0.9" />
            <ellipse
              cx="26"
              cy="24"
              rx="4.5"
              ry="5.5"
              fill="white"
              opacity="0.9"
            />
            <ellipse
              cx="38"
              cy="24"
              rx="4.5"
              ry="5.5"
              fill="white"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* Brand */}
        <h1 className="mb-1 text-3xl font-bold tracking-tight text-[#3D1F0A] font-serif">
          PawHome
        </h1>

        <p className="mb-8 text-sm font-medium tracking-[0.18em] text-[#C4773A]">
          RESCUE · ADOPT · LOVE
        </p>

        {/* Message */}
        <div
          className={`mb-6 min-h-[40px] text-center text-sm text-[#8A5C3A] transition-opacity duration-500 ${
            fadeMsg ? "opacity-100" : "opacity-0"
          }`}
        >
          {loadingMessages[msgIndex]}
        </div>

        {/* Progress */}
        <div className="w-full">
          <div className="mb-2 flex justify-between text-xs text-[#C4A07A]">
            <span>Đang tải...</span>
            <span>{progress}%</span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-[#F5E6D3]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#F6A96C] to-[#F07A3A] transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Paw Trail */}
        <div className="mt-5 flex gap-2">
          {[0, 1, 2, 3].map((item) => (
            <span
              key={item}
              className="inline-block animate-paw-bounce text-base opacity-70"
              style={{ animationDelay: `${item * 0.2}s` }}
            >
              🐾
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
