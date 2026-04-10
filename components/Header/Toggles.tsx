"use client";

import { Moon, Sun, Globe } from "lucide-react";

type Props = {
  isDark: boolean;
  toggleDark: () => void;
  lang: "vi" | "en";
  setLang: (l: "vi" | "en") => void;
};

export function DarkToggle({ isDark, toggleDark }: Props) {
  return (
    <button
      onClick={toggleDark}
      className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

export function LangToggle({ lang, setLang }: Props) {
  return (
    <button
      onClick={() => setLang(lang === "vi" ? "en" : "vi")}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-bold hover:bg-white/20 transition"
    >
      <Globe size={13} />
      {lang === "vi" ? "🇻🇳 VI" : "🇺🇸 EN"}
    </button>
  );
}
