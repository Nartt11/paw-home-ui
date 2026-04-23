"use client";

import * as React from "react";
import { Heart, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function DonateSuccessCard({
  amountLabel,
  email,
  transactionId,
  onDonateAgain,
}: {
  amountLabel: string;
  email: string;
  transactionId: string;
  onDonateAgain: () => void;
}) {
  return (
    <div className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto grid max-w-lg place-items-center">
        <Card className="w-full rounded-3xl shadow-lg shadow-black/5 ring-1 ring-border">
          <CardContent className="p-10 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-muted text-4xl">
              💝
            </div>
            <h2 className="mt-6 text-2xl font-black text-foreground">
              Cảm ơn bạn!
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Khoản ủng hộ{" "}
              <span className="font-bold text-primary">{amountLabel}</span> của
              bạn đã được ghi nhận. Chúng tôi sẽ gửi email xác nhận đến{" "}
              <span className="font-semibold text-foreground">
                {email || "email của bạn"}
              </span>{" "}
              trong vòng 24 giờ.
            </p>

            <div className="mt-5 rounded-2xl bg-muted p-4 ring-1 ring-border">
              <div className="text-xs text-muted-foreground">Mã giao dịch</div>
              <div className="mt-1 text-lg font-extrabold tracking-widest text-foreground">
                {transactionId}
              </div>
            </div>

            <div className="mt-5 flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5"
                  fill="#F7DB47"
                  color="#F7DB47"
                />
              ))}
            </div>

            <Button onClick={onDonateAgain} className="mt-7 w-full">
              <Heart className="h-4 w-4" /> Ủng hộ thêm lần nữa
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
