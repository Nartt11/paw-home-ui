import type { DonateMethod } from "@/types/donate.type";

export function formatVND(amount: number) {
  return `${amount.toLocaleString("vi-VN")}₫`;
}

export function parseMoneyInputToNumber(value: string) {
  const numeric = value.replace(/\D/g, "");
  return numeric ? Number.parseInt(numeric, 10) : 0;
}

export function formatMoneyInput(value: string) {
  const n = parseMoneyInputToNumber(value);
  return n ? n.toLocaleString("vi-VN") : "";
}

export function methodLabel(method: DonateMethod) {
  switch (method) {
    case "transfer":
      return "🏦 Chuyển khoản";
    case "momo":
      return "💜 MoMo";
    case "vnpay":
      return "🔵 VNPay";
  }
}
