"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Heart, MapPin, Star } from "lucide-react";

import type {
  EventItem,
  PublicPageData,
  StoryItem,
} from "@/types/public-page.type";
import landingData from "./data.json" assert { type: "json" };
import HeroSection from "@/components/HomePage/HeroSection";
import StatsSection from "@/components/HomePage/StatsSection";
import FeaturedPetsSection from "@/components/HomePage/FeaturedPetsSection";
import { Pet } from "@/types/pet.type";
import VolunteerSection from "@/components/HomePage/VolunteerSection";
import HowItWorksSection from "@/components/HomePage/HowItWorksSection";
import RescueMapSection from "@/components/HomePage/RescueMapSection";

const EVENT_IMG =
  "https://images.unsplash.com/photo-1772812714595-3d83ae2e8526?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900";
const PUPPY_IMG =
  "https://images.unsplash.com/photo-1544047963-99e58dfea839?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600";
const CAT_IMG =
  "https://images.unsplash.com/photo-1769634847839-64142e1dd4c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600";
const WALK_IMG =
  "https://images.unsplash.com/photo-1603726574566-85a319ef2f52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600";

const DATA = landingData as PublicPageData;

// Success story card + skeleton
// interface StoryCardProps {
//   story: StoryItem;
// }

// function StoryCard({ story }: StoryCardProps) {
//   return (
//     <article className="overflow-hidden rounded-2xl bg-slate-50">
//       <div className="h-52 overflow-hidden">
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           src={
//             story.img === "CAT_IMG"
//               ? CAT_IMG
//               : story.img === "PUPPY_IMG"
//                 ? PUPPY_IMG
//                 : WALK_IMG
//           }
//           alt={story.name}
//           className="h-full w-full object-cover"
//         />
//       </div>
//       <div className="space-y-3 px-5 py-5">
//         <div className="flex gap-1 text-amber-400">
//           {Array.from({ length: story.stars }).map((_, index) => (
//             <Star key={index} size={14} className="fill-current" />
//           ))}
//         </div>
//         <p className="text-[13px] italic leading-relaxed text-slate-800">
//           &quot;{story.text}&quot;
//         </p>
//         <div className="flex items-center justify-between text-[13px]">
//           <span className="font-semibold text-slate-900">{story.name}</span>
//           <span className="flex items-center gap-1 text-[11px] text-slate-400">
//             <MapPin size={11} />
//             {story.loc}
//           </span>
//         </div>
//       </div>
//     </article>
//   );
// }

// function StoryCardSkeleton() {
//   return (
//     <div className="animate-pulse overflow-hidden rounded-2xl bg-slate-50">
//       <div className="h-52 w-full bg-slate-200" />
//       <div className="space-y-3 px-5 py-5">
//         <div className="flex gap-1">
//           <div className="h-4 w-20 rounded bg-slate-200" />
//         </div>
//         <div className="space-y-2">
//           <div className="h-3 w-full rounded bg-slate-200" />
//           <div className="h-3 w-3/4 rounded bg-slate-200" />
//         </div>
//         <div className="flex items-center justify-between">
//           <div className="h-3 w-24 rounded bg-slate-200" />
//           <div className="h-3 w-20 rounded bg-slate-200" />
//         </div>
//       </div>
//     </div>
//   );
// }

// Event card + skeleton
interface EventCardProps {
  event: EventItem;
}

// function EventCard({ event }: EventCardProps) {
//   const dateNumber = event.date.split("/")[0];

//   return (
//     <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md">
//       <div className="relative h-52 overflow-hidden">
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           src={event.img || EVENT_IMG}
//           alt={event.name}
//           className="h-full w-full object-cover"
//         />
//         <div className="absolute left-3 top-3 rounded-2xl bg-white px-4 py-2 text-center shadow-md">
//           <div className="text-[22px] font-black leading-none text-[#FF9132]">
//             {dateNumber}
//           </div>
//           <div className="mt-0.5 text-[9px] font-bold tracking-[0.2em] text-slate-500">
//             {event.month}
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-1 flex-col px-5 py-5">
//         <h3 className="mb-2 text-[17px] font-extrabold text-slate-900">
//           {event.name}
//         </h3>
//         <div className="mb-3 flex items-center gap-1 text-[12px] text-slate-600">
//           <MapPin size={12} />
//           <span>{event.location}</span>
//         </div>
//         <p className="mb-4 flex-1 text-[13px] leading-relaxed text-slate-600">
//           {event.desc}
//         </p>
//         <button
//           type="button"
//           className="w-full rounded-xl bg-linear-to-r from-[#FF9132] to-[#F7DB47] py-2.5 text-[13px] font-bold text-white shadow-md"
//         >
//           Đăng ký tham gia →
//         </button>
//       </div>
//     </article>
//   );
// }

// function EventCardSkeleton() {
//   return (
//     <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md animate-pulse">
//       <div className="h-52 w-full bg-slate-200" />
//       <div className="flex flex-1 flex-col space-y-3 px-5 py-5">
//         <div className="h-4 w-40 rounded bg-slate-200" />
//         <div className="h-3 w-48 rounded bg-slate-200" />
//         <div className="space-y-2">
//           <div className="h-3 w-full rounded bg-slate-200" />
//           <div className="h-3 w-3/4 rounded bg-slate-200" />
//         </div>
//         <div className="mt-auto h-9 w-full rounded-xl bg-slate-200" />
//       </div>
//     </div>
//   );
// }

// Section components

interface SuccessStoriesSectionProps {
  stories: StoryItem[];
  loading: boolean;
}

// function SuccessStoriesSection({
//   stories,
//   loading,
// }: SuccessStoriesSectionProps) {
//   return (
//     <section className="bg-white px-6 py-12 md:py-16">
//       <div className="mx-auto max-w-5xl">
//         <div className="mb-10 text-center">
//           <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#FFF4EC] px-3 py-1 text-[11px] font-bold text-[#FF9132]">
//             <Star size={13} className="fill-current" />
//             CÂU CHUYỆN THÀNH CÔNG
//           </div>
//           <h2 className="text-balance text-[26px] font-black text-slate-900 md:text-[34px]">
//             Họ đã tìm thấy nhau
//           </h2>
//         </div>

//         {loading ? (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {Array.from({ length: 3 }).map((_, index) => (
//               <StoryCardSkeleton key={index} />
//             ))}
//           </div>
//         ) : (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {stories.map((story) => (
//               <StoryCard key={story.name} story={story} />
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

interface EventsSectionProps {
  events: EventItem[];
  loading: boolean;
}

// function EventsSection({ events, loading }: EventsSectionProps) {
//   return (
//     <section className="bg-slate-50 px-6 py-12 md:py-16">
//       <div className="mx-auto max-w-5xl">
//         <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
//           <div>
//             <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#FFFCE0] px-3 py-1 text-[11px] font-bold text-[#8B6900]">
//               <CalendarDays size={13} className="text-[#8B6900]" />
//               SỰ KIỆN SẮP TỚI
//             </div>
//             <h2 className="text-balance text-[26px] font-black text-slate-900 md:text-[34px]">
//               Tham gia cùng HPA
//             </h2>
//           </div>
//         </div>

//         {loading ? (
//           <div className="grid gap-6 md:grid-cols-2">
//             {Array.from({ length: 2 }).map((_, index) => (
//               <EventCardSkeleton key={index} />
//             ))}
//           </div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2">
//             {events.map((event) => (
//               <EventCard key={event.name} event={event} />
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// function DonateSection() {
//   const tiers = [
//     { amount: "50.000₫", desc: "1 ngày thức ăn" },
//     { amount: "200.000₫", desc: "Tiêm vaccine" },
//     { amount: "500.000₫", desc: "Khám sức khỏe" },
//   ];

//   return (
//     <section className="bg-white px-6 py-12 md:py-16">
//       <div className="mx-auto max-w-5xl">
//         <div className="rounded-[28px] border border-amber-300/80 bg-linear-to-br from-[#FFF4EC] to-[#FFFCE0] px-6 py-10 text-center md:px-12 md:py-12">
//           <div className="mb-4 text-5xl">💝</div>
//           <h2 className="mb-4 text-balance text-[26px] font-black text-slate-900 md:text-[34px]">
//             Mỗi đồng ủng hộ đều có ý nghĩa
//           </h2>
//           <p className="mx-auto mb-8 max-w-xl text-[15px] leading-relaxed text-slate-600">
//             100% số tiền được dùng trực tiếp cho thức ăn, thuốc men và chăm sóc
//             thú cưng. Không chi phí quản lý.
//           </p>

//           <div className="mb-7 flex flex-wrap justify-center gap-3">
//             {tiers.map((tier) => (
//               <button
//                 key={tier.amount}
//                 type="button"
//                 className="rounded-2xl border-2 border-[#FF9132] bg-white px-5 py-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
//               >
//                 <div className="text-[18px] font-extrabold text-[#FF9132]">
//                   {tier.amount}
//                 </div>
//                 <div className="mt-1 text-[11px] text-slate-600">
//                   {tier.desc}
//                 </div>
//               </button>
//             ))}
//           </div>

//           <Link
//             href="/donate"
//             className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#FF9132] to-[#FF584F] px-10 py-4 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(255,145,50,0.4)]"
//           >
//             <Heart size={20} className="fill-current" />
//             Ủng hộ ngay
//             <ArrowRight size={18} />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const [isPetsLoading, setIsPetsLoading] = useState(true);
  const [isStoriesLoading, setIsStoriesLoading] = useState(true);
  const [isEventsLoading, setIsEventsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsPetsLoading(false);
      setIsStoriesLoading(false);
      setIsEventsLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="bg-white text-slate-900">
      <HeroSection
        hero={DATA.hero}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <StatsSection stats={DATA.stats} />
      {/* <FeaturedPetsSection pets={DATA.pets} loading={isPetsLoading} /> */}
      <HowItWorksSection steps={DATA.howItWorksSteps} />
      <RescueMapSection stats={DATA.rescueMapStats} />
      {/* ----maybe later */}
      {/* <SuccessStoriesSection 
        stories={DATA.stories}
        loading={isStoriesLoading}
      /> */}
      {/* event maybe later: event */}
      {/* <EventsSection events={DATA.events} loading={isEventsLoading} /> */}
      <VolunteerSection />
    </div>
  );
}
