"use client";

import * as React from "react";

import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { DonateBankInfo, DonateMethod } from "@/types/donate.type";
import { methodLabel } from "@/components/donate/donate-utils";

export function DonateConfirmCard({
  amountLabel,
  method,
  name,
  email,
  bankInfo,
  onBack,
  onConfirm,
}: {
  amountLabel: string;
  method: DonateMethod;
  name: string;
  email: string;
  bankInfo: DonateBankInfo;
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

        {method === "transfer" ? (
          <div className="mt-5 rounded-2xl bg-secondary p-4 ring-1 ring-border">
            <div className="text-xs font-bold text-foreground">
              Thông tin chuyển khoản
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex gap-2">
                <span className="w-28 shrink-0 text-muted-foreground">
                  Ngân hàng:
                </span>
                <span className="font-semibold text-foreground">
                  {bankInfo.bank}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="w-28 shrink-0 text-muted-foreground">
                  STK:
                </span>
                <span className="font-semibold text-foreground">
                  {bankInfo.account_number}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="w-28 shrink-0 text-muted-foreground">
                  Chủ TK:
                </span>
                <span className="font-semibold text-foreground">
                  {bankInfo.account_name}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="w-28 shrink-0 text-muted-foreground">
                  Nội dung:
                </span>
                <span className="font-semibold text-foreground">
                  ỦNGHỘ {amountLabel}
                  {name ? ` ${name.toUpperCase()}` : ""}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onBack}>
            Quay lại
          </Button>
          <Button className="flex-2" onClick={onConfirm}>
            <Heart className="h-4 w-4" />
            Xác nhận ủng hộ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
