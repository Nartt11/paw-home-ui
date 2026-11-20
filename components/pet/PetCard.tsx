"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { APP_ROUTES } from "@/constants/routes";
import {
  PET_STATUS_BADGE_SOLID,
  breedLabel,
  formatPetAge,
  petGenderLabel,
  petHealthLabel,
  petStatusLabel,
  speciesLabel,
} from "@/lib/pet-display";
import type { Pet, PetSummary } from "@/types/pet.type";

interface PetCardProps {
  pet: Pet | PetSummary;
  href?: string;
}

const IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200";

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
  const statusClass =
    PET_STATUS_BADGE_SOLID[pet.status] ?? "bg-slate-700 text-white";

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
              <span className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
                Đã tiêm vaccine
              </span>
            ) : null}
            {isPetDetail(pet) && pet.neutered ? (
              <span className="rounded-full bg-sky-700 px-3 py-1 text-xs font-semibold text-white">
                Đã triệt sản
              </span>
            ) : null}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-white/85">
                {speciesLabel(pet)}
              </p>
              <h3 className="mt-1 truncate text-2xl font-black text-white">
                {pet.name}
              </h3>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
            >
              {petStatusLabel(pet.status)}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col space-y-4 px-5 pb-5 pt-4">
          {/* One sentence that wraps as a whole, so short values never split into columns. */}
          <p className="text-sm leading-6 text-slate-600">
            {petGenderLabel(pet.gender)} · {formatPetAge(pet.age)} ·{" "}
            {breedLabel(pet)}
          </p>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin size={14} className="shrink-0 text-orange-600" aria-hidden />
            <span className="line-clamp-1">{location}</span>
          </div>

          <dl className="space-y-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="shrink-0 text-slate-600">Sức khỏe</dt>
              <dd className="min-w-0 truncate text-right font-semibold text-slate-900">
                {petHealthLabel(pet.healthStatus)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="shrink-0 text-slate-600">Tổ chức</dt>
              <dd
                className="min-w-0 truncate text-right font-semibold text-slate-900"
                title={pet.organization?.name || "Cộng đồng"}
              >
                {pet.organization?.name || "Cộng đồng"}
              </dd>
            </div>
          </dl>

          {isPetDetail(pet) && pet.description ? (
            <p className="line-clamp-3 text-sm leading-6 text-slate-600">
              {pet.description}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
