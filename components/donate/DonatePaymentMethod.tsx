"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DonateMethod } from "@/types/donate.type";

const METHODS: Array<{
  id: DonateMethod;
  emoji: string;
  label: string;
  desc: string;
}> = [
  {
    id: "transfer",
    emoji: "🏦",
    label: "Chuyển khoản ngân hàng",
    desc: "Vietcombank · MB Bank · Techcombank",
  },
  {
    id: "momo",
    emoji: "💜",
    label: "Ví MoMo",
    desc: "Quét mã QR thanh toán ngay",
  },
  {
    id: "vnpay",
    emoji: "🔵",
    label: "VNPay",
    desc: "Thẻ ATM nội địa & quốc tế",
  },
];

export function DonatePaymentMethod({
  value,
  onChange,
}: {
  value: DonateMethod;
  onChange: (value: DonateMethod) => void;
}) {
  return (
    <Card className="rounded-3xl shadow-sm ring-1 ring-slate-200">
      <CardHeader>
        <CardTitle className="text-base font-extrabold text-slate-900">
          Phương thức thanh toán
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {METHODS.map((m) => {
          const selected = value === m.id;

          return (
            <Button
              key={m.id}
              type="button"
              variant="outline"
              onClick={() => onChange(m.id)}
              className={
                "h-auto w-full justify-start gap-4 rounded-xl border-2 px-4 py-4 text-left " +
                (selected
                  ? "border-slate-900 bg-slate-50"
                  : "border-slate-200 bg-white")
              }
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="flex-1">
                <span
                  className={
                    "block text-sm font-bold " +
                    (selected ? "text-slate-900" : "text-slate-900")
                  }
                >
                  {m.label}
                </span>
                <span className="block text-xs text-slate-500">{m.desc}</span>
              </span>
              <span
                className={
                  "grid h-5 w-5 place-items-center rounded-full border-2 " +
                  (selected
                    ? "border-slate-900 bg-slate-900"
                    : "border-slate-200 bg-white")
                }
              >
                {selected ? (
                  <span className="block h-2 w-2 rounded-full bg-white" />
                ) : null}
              </span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
