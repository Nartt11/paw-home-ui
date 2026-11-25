"use client";

import * as React from "react";
import { ArrowRight, Heart } from "lucide-react";

import rawData from "./data.json";
import Link from "next/link";
import { usePublicStats } from "@/hooks/use-public-stats";
import { APP_ROUTES } from "@/constants/routes";
import type { DonateData, DonateMethod, DonateStep } from "@/types/donate.type";

import { Button } from "@/components/ui/button";

import { DonateHero } from "@/components/donate/DonateHero";
import { DonateTierSelector } from "@/components/donate/DonateTierSelector";
import { DonateCustomAmount } from "@/components/donate/DonateCustomAmount";
import { DonateDonorInfoForm } from "@/components/donate/DonateDonorInfoForm";
import { DonatePaymentMethod } from "@/components/donate/DonatePaymentMethod";
import { DonateConfirmCard } from "@/components/donate/DonateConfirmCard";
import { DonateSuccessCard } from "@/components/donate/DonateSuccessCard";
import { DonateSidebar } from "@/components/donate/DonateSidebar";

import {
  formatVND,
  parseMoneyInputToNumber,
} from "@/components/donate/donate-utils";

const DATA = rawData as DonateData;

export default function DonatePage() {
  const live = usePublicStats().data;
  const heroStats = live
    ? [
        { value: live.casesRescued.toLocaleString("vi-VN"), label: "Ca đã cứu", tone: "sun" },
        { value: live.petsWaiting.toLocaleString("vi-VN"), label: "Bé đang chờ nhà", tone: "emerald" },
        { value: live.activeCentres.toLocaleString("vi-VN"), label: "Trạm đang hoạt động", tone: "orange" },
      ]
    : undefined;
  const [step, setStep] = React.useState<DonateStep>("choose");
  const [method, setMethod] = React.useState<DonateMethod>("transfer");

  const [selectedTier, setSelectedTier] = React.useState<string>(
    DATA.tiers.find((t) => t.popular)?.id ?? DATA.tiers[0]?.id ?? "",
  );
  const [customAmount, setCustomAmount] = React.useState<string>("");

  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");
  const [showName, setShowName] = React.useState<boolean>(true);

  const chosenTier = React.useMemo(
    () => DATA.tiers.find((t) => t.id === selectedTier),
    [selectedTier],
  );

  const customAmountNumber = React.useMemo(
    () => parseMoneyInputToNumber(customAmount),
    [customAmount],
  );

  const finalAmount = customAmountNumber || chosenTier?.amount || 0;
  const finalLabel = finalAmount ? formatVND(finalAmount) : "";

  const [transactionId] = React.useState<string>(
    () => `HPA-${Date.now().toString().slice(-6)}`,
  );

  if (step === "success") {
    return (
      <DonateSuccessCard
        amountLabel={finalLabel}
        email={email}
        transactionId={transactionId}
        onDonateAgain={() => {
          setStep("choose");
          setCustomAmount("");
          setName("");
          setEmail("");
          setMessage("");
          setShowName(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <DonateHero data={DATA.hero} stats={heroStats} />

      <main className="mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900" role="note">
          <strong>Ủng hộ trực tuyến đang được phát triển.</strong> Trang này là bản mẫu: không có giao dịch nào được thực hiện và
          không thu tiền. Muốn giúp ngay, hãy{" "}
          <Link href={APP_ROUTES.MAP} className="font-semibold underline underline-offset-4">
            liên hệ một trạm cứu hộ trên bản đồ
          </Link>
          .
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="space-y-5">
            {step === "choose" ? (
              <>
                <DonateTierSelector
                  tiers={DATA.tiers}
                  selectedTierId={selectedTier}
                  onSelectTier={(id) => {
                    setSelectedTier(id);
                    setCustomAmount("");
                  }}
                />

                <DonateCustomAmount
                  value={customAmount}
                  onChange={setCustomAmount}
                />

                <DonateDonorInfoForm
                  name={name}
                  email={email}
                  message={message}
                  showName={showName}
                  onChange={(next) => {
                    if (next.name !== undefined) setName(next.name);
                    if (next.email !== undefined) setEmail(next.email);
                    if (next.message !== undefined) setMessage(next.message);
                    if (next.showName !== undefined) setShowName(next.showName);
                  }}
                />

                <DonatePaymentMethod value={method} onChange={setMethod} />

                <Button
                  type="button"
                  onClick={() => {
                    if (finalAmount > 0) setStep("confirm");
                  }}
                  disabled={finalAmount <= 0}
                  size="lg"
                  className="w-full rounded-2xl"
                >
                  <Heart className="h-5 w-5" />
                  {finalAmount > 0
                    ? `Ủng hộ ${finalLabel} ngay`
                    : "Chọn mức ủng hộ để tiếp tục"}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <DonateConfirmCard
                amountLabel={finalLabel}
                method={method}
                name={showName ? name : ""}
                email={email}
                onBack={() => setStep("choose")}
                onConfirm={() => setStep("success")}
              />
            )}
          </section>

          <DonateSidebar
            impactBars={DATA.impactBars}
            impacts={DATA.impacts}
          />
        </div>

        {message ? (
          <p className="mt-6 text-xs text-muted-foreground">
            Lời nhắn của bạn sẽ được ghi nhận nội bộ (mock): {message}
          </p>
        ) : null}
      </main>
    </div>
  );
}
