"use client";

import { Moon, Sun, Globe } from "lucide-react";

type Props = {
  isDark: boolean;
  toggleDark: () => void;
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

