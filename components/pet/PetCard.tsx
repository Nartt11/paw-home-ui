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
      return "Duc";
    case "FEMALE":
      return "Cai";
    default:
      return "Chua ro";
  }
}

function getStatusLabel(status: Pet["status"] | PetSummary["status"]) {
  switch (status) {
    case "UNOWNED":
      return {
        text: "San sang nhan nuoi",
        className: "bg-emerald-50 text-emerald-600",
      };
    case "PENDING":
      return {
        text: "Dang cho duyet",
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
    ? pet.rescueLocation || pet.province || "Khong xac dinh"
    : pet.province || "Khong xac dinh";
  const speciesLabel = pet.species || "Thu cung";
  const ageLabel = pet.ageDisplay || `${pet.age} thang`;
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
                Da tiem vaccine
              </span>
            ) : null}
            {isPetDetail(pet) && pet.neutered ? (
              <span className="rounded-full bg-sky-500/95 px-3 py-1 text-[10px] font-bold text-white">
                Da triet san
              </span>
            ) : null}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                {speciesLabel}
              </p>
              <h3 className="mt-1 text-2xl font-black text-white">{pet.name}</h3>
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
            <span>{pet.breed || "Dang cap nhat"}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={14} className="shrink-0 text-orange-500" />
            <span className="line-clamp-1">{location}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 px-3 py-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Suc khoe
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
                {pet.organization?.name || "Cong dong"}
              </div>
            </div>
          </div>

          {isPetDetail(pet) ? (
            <p className="line-clamp-3 text-sm leading-6 text-slate-600">
              {pet.description || "Be dang tim mot mai am an toan va yeu thuong."}
            </p>
          ) : (
            <p className="line-clamp-3 text-sm leading-6 text-slate-600">
              Be dang san sang cho mot gia dinh moi. Hay mo card chi tiet khi luong
              nhan nuoi duoc hoan thien.
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
