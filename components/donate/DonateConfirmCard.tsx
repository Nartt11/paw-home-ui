"use client";

import * as React from "react";

import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { DonateMethod } from "@/types/donate.type";
import { methodLabel } from "@/components/donate/donate-utils";

export function DonateConfirmCard({
  amountLabel,
  method,
  name,
  email,
  onBack,
  onConfirm,
}: {
  amountLabel: string;
  method: DonateMethod;
  name: string;
  email: string;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const rows = React.useMemo(
    () => [
      { label: "Số tiền ủng hộ", value: amountLabel, emphasis: true },
      { label: "Phương thức", value: methodLabel(method) },
      { label: "Họ tên", value: name || "(Ẩn danh)" },
      { label: "Email", value: email || "—" },
    ],
    [amountLabel, email, method, name],
  );

  return (
    <Card className="rounded-3xl shadow-sm ring-1 ring-border">
      <CardHeader>
        <CardTitle className="text-lg font-extrabold">
          Xác nhận ủng hộ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl bg-muted p-5 ring-1 ring-border">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between border-b border-border py-3 last:border-0"
            >
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span
                className={
                  "text-sm font-semibold " +
                  (row.emphasis ? "text-primary" : "text-foreground")
                }
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900" role="note">
          Ủng hộ trực tuyến chưa mở: bấm xác nhận sẽ <strong>không</strong> chuyển tiền. Đừng chuyển khoản theo bất kỳ thông tin nào
          bạn thấy trên mạng nhân danh PawHome.
        </p>

        <div className="mt-5 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onBack}>
            Quay lại
          </Button>
          <Button className="flex-2" onClick={onConfirm}>
            <Heart className="h-4 w-4" />
            Xác nhận (bản mẫu)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
