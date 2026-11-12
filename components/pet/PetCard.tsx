"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { APP_ROUTES } from "@/constants/routes";
import type { Pet, PetSummary } from "@/types/pet.type";

interface PetCardProps {
  pet: Pet | PetSummary;
  href?: string;
}

const IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200";

function getGenderLabel(gender: Pet["gender"] | PetSummary["gender"]) {
  switch (gender) {
    case "MALE":
      return "Đực";
    case "FEMALE":
      return "Cái";
    default:
      return "Chưa rõ";
  }
}

function getStatusLabel(status: Pet["status"] | PetSummary["status"]) {
  switch (status) {
    case "AVAILABLE":
      return {
        text: "Sẵn sàng nhận nuôi",
        className: "bg-emerald-50 text-emerald-600",
      };
    case "LOST":
      return {
        text: "Đang thất lạc",
        className: "bg-amber-50 text-amber-600",
      };
    default:
      return {
        text: status,
        className: "bg-slate-100 text-slate-600",
      };
  }
}

function isPetDetail(pet: Pet | PetSummary): pet is Pet {
  return "imageUrls" in pet;
}

export default function PetCard({
  pet,
  href = APP_ROUTES.adoptionDetail(pet.petId),
}: PetCardProps) {
  const imageSrc = isPetDetail(pet) ? pet.imageUrls[0] : pet.imageUrl;
  const location = isPetDetail(pet)
    ? pet.rescueLocation || pet.province || "Không xác định"
    : pet.province || "Không xác định";
  const speciesLabel = pet.species || "Thú cưng";
  const ageLabel = pet.ageDisplay || `${pet.age} tháng`;
  const status = getStatusLabel(pet.status);

  return (
    <Link href={href} className="block">
      <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-60 overflow-hidden bg-slate-100">
          <Image
            src={imageSrc || IMAGE_FALLBACK}
            alt={pet.name}
            width={400}
            height={400}
            unoptimized
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/65 via-slate-950/10 to-transparent" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {pet.vaccinated ? (
              <span className="rounded-full bg-emerald-500/95 px-3 py-1 text-[10px] font-bold text-white">
                Đã tiêm vaccine
              </span>
            ) : null}
            {isPetDetail(pet) && pet.neutered ? (
              <span className="rounded-full bg-sky-500/95 px-3 py-1 text-[10px] font-bold text-white">
                Đã triệt sản
              </span>
            ) : null}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                {speciesLabel}
              </p>
              <h3 className="mt-1 text-2xl font-black text-white">
                {pet.name}
              </h3>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold ${status.className}`}
            >
              {status.text}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col space-y-4 px-5 pb-5 pt-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>{getGenderLabel(pet.gender)}</span>
            <span className="text-slate-300">•</span>
            <span>{ageLabel}</span>
            <span className="text-slate-300">•</span>
            <span>{pet.breed || "Đang cập nhật"}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={14} className="shrink-0 text-orange-500" />
            <span className="line-clamp-1">{location}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 px-3 py-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Sức khỏe
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {pet.healthStatus}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 px-3 py-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                To chuc
              </div>
              <div className="mt-1 line-clamp-1 text-sm font-semibold text-slate-900">
                {pet.organization?.name || "Cộng đồng"}
              </div>
            </div>
          </div>

          {isPetDetail(pet) ? (
            <p className="line-clamp-3 text-sm leading-6 text-slate-600">
              {pet.description ||
                "Bé đang tìm một mái ấm an toàn và yêu thương."}
            </p>
          ) : (
            <p className="line-clamp-3 text-sm leading-6 text-slate-600">
              Bé đang sẵn sàng cho một gia đình mới. Hãy mở card chi tiết khi
              lựa nhận nuôi được hoàn thiện.
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
