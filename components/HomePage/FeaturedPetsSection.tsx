import { ArrowRight, Heart } from "lucide-react";
import PetCard from "../pet/PetCard";
import GridSkeleton from "../pet/GridSkeleton";
import { Pet } from "@/types/pet.type";
import Link from "next/link";

interface FeaturedPetsSectionProps {
  pets: Pet[];
  loading: boolean;
}

export default function FeaturedPetsSection({
  pets,
  loading,
}: FeaturedPetsSectionProps) {
  const availableCount = pets.filter((p) => p.status === "AVAILABLE").length;

  console.log("Available pets:", pets);

  return (
    <section className="bg-slate-50 px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#FFF4EC] px-3 py-1 text-[11px] font-bold text-[#FF9132]">
              <Heart size={13} className="text-[#FF9132]" />
              ĐANG CHỜ MÁI ẤM MỚI
            </div>
            <h2 className="text-balance text-[26px] font-black text-slate-900 md:text-[34px]">
              Thú cưng nổi bật
            </h2>
            <p className="mt-2 text-[14px] text-slate-500">
              {availableCount} bé đang cần được yêu thương
            </p>
          </div>
          <Link
            href="/pets"
            className="inline-flex items-center gap-1 rounded-xl border-2 border-[#03354F] px-5 py-2 text-[13px] font-bold text-[#03354F]"
          >
            Xem tất cả
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <GridSkeleton cards={4} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pets.map((pet) => (
              <PetCard key={pet.pet_id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
