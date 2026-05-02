"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import { formatMoneyInput } from "@/components/donate/donate-utils";

export function DonateCustomAmount({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Card className="rounded-2xl bg-slate-50 shadow-none ring-1 ring-slate-200">
      <CardContent className="p-4">
        <label className="block text-xs font-semibold text-slate-500">
          Hoặc nhập số tiền khác
        </label>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-bold text-slate-500">₫</span>
          <Input
            value={value}
            onChange={(e) => onChange(formatMoneyInput(e.target.value))}
            placeholder="Nhập số tiền (VD: 300.000)"
            className="h-10 border-slate-200 bg-white font-semibold"
            inputMode="numeric"
          />
        </div>
      </CardContent>
    </Card>
  );
}
