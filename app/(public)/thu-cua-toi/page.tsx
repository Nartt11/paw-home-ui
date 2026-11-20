"use client";

import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, PawPrint } from "lucide-react";

import RequireAuth from "@/components/auth/RequireAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/routes";
import { useMyPets } from "@/hooks/use-followup";
import { breedLabel, formatPetAge, petGenderLabel, petHealthLabel, speciesLabel } from "@/lib/pet-display";
import type { PetSummary } from "@/types/pet.type";

/** Shown only for pets adopted through PawHome, as the design asks: "Nhận nuôi từ {tổ chức}". */
function originLabel(pet: PetSummary) {
  if (pet.acquisitionType !== "ADOPTED") return null;
  return `Nhận nuôi từ ${pet.sourceOrganization?.name ?? pet.organization?.name ?? "trung tâm"}`;
}

function MyPets() {
  const petsQuery = useMyPets();
  const pets = petsQuery.data?.content ?? [];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Thú của tôi</h1>
          <p className="mt-1 text-muted-foreground">Các bé bạn đang nuôi: nhận nuôi qua PawHome hoặc bé bạn đã cứu và giữ lại.</p>
        </div>
      </div>

      {petsQuery.isPending ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-64 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-14 text-center">
          <PawPrint className="h-9 w-9 text-muted-foreground" aria-hidden />
          <div className="font-semibold">Chưa có bé nào ở đây</div>
          <p className="max-w-md text-sm text-muted-foreground">
            Khi bạn nhận nuôi thành công, hoặc giữ lại một bé đã cứu, hồ sơ của bé sẽ hiện ở đây kèm lịch hỏi thăm và hồ sơ sức khoẻ.
          </p>
          <Button asChild>
            <Link href={APP_ROUTES.ADOPTION}>Tìm bé cần nhà</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => {
            const origin = originLabel(pet);
            return (
              <li key={pet.petId} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="relative aspect-[4/3] bg-muted">
                  {pet.imageUrl ? (
                    <Image src={pet.imageUrl} alt={pet.name} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                  ) : (
                    <PawPrint className="absolute inset-0 m-auto h-10 w-10 text-muted-foreground" aria-hidden />
                  )}
                </div>
                <div className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold">{pet.name}</h2>
                    {pet.healthStatus ? <Badge variant="outline">{petHealthLabel(pet.healthStatus)}</Badge> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {[speciesLabel(pet), breedLabel(pet), petGenderLabel(pet.gender), formatPetAge(pet.age)]
                      .filter((part) => part && part !== "—")
                      .join(" · ")}
                  </p>
                  {origin ? (
                    <p className="flex items-center gap-1.5 text-sm text-primary">
                      <HeartHandshake className="h-4 w-4" aria-hidden /> {origin}
                    </p>
                  ) : null}
                  {pet.acquisitionType === "ADOPTED" ? (
                    <Link href={APP_ROUTES.MY_ADOPTIONS} className="text-sm font-medium text-primary hover:underline">
                      Lịch hỏi thăm và hỗ trợ
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function MyPetsPage() {
  return (
    <RequireAuth>
      <MyPets />
    </RequireAuth>
  );
}
