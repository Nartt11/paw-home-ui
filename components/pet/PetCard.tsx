import { Pet } from "@/types/pet.type";
import { Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface PetCardProps {
  pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <Link href="/pets" className="block">
      <article className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
        <div className="relative h-56 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pet.image}
            alt={pet.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 to-transparent" />

          <div className="absolute bottom-2 left-3 flex gap-1.5 text-[9px] font-bold">
            {pet.is_vaccinated && (
              <span className="rounded-full bg-[#2AC789] px-2 py-0.5 text-white">
                ✓ Vaccine
              </span>
            )}
            {pet.is_neutered && (
              <span className="rounded-full bg-[#06A7E7] px-2 py-0.5 text-white">
                ✓ Triệt sản
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3 px-4 pb-4 pt-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[17px] font-extrabold text-slate-900">
                {pet.name}
              </h3>
              <p className="mt-0.5 text-[12px] text-slate-500">
                {pet.breed === "dog" ? "🐕 Chó" : "🐈 Mèo"} ·{" "}
                {pet.gender === "male" ? "♂" : "♀"} · {pet.age}
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                pet.status === "available"
                  ? "bg-emerald-50 text-emerald-500"
                  : "bg-amber-50 text-amber-500"
              }`}
            >
              {pet.status === "available" ? "✓ Sẵn sàng" : "⏳ Đang xét"}
            </span>
          </div>

          <div className="mb-3 flex items-center gap-1 text-[11px] text-slate-400">
            <MapPin size={11} className="shrink-0" />
            <span>{pet.rescue_location || "Không xác định"}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="rounded-xl bg-slate-50 px-2 py-1.5">
              <div className="text-[10px] text-slate-500">Cân nặng</div>
              <div className="text-[13px] font-bold text-slate-900">
                {pet.weight}
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 px-2 py-1.5">
              <div className="text-[10px] text-slate-500">Màu sắc</div>
              <div className="text-[13px] font-bold text-slate-900">
                {pet.color}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
