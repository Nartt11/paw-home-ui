"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { HeartHandshake, PawPrint, Search, Sparkles } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import GridSkeleton from "@/components/pet/GridSkeleton";
import PetCard from "@/components/pet/PetCard";
import { APP_ROUTES } from "@/constants/routes";
import { useActiveBanners } from "@/hooks/use-banner";
import {
  getOptionalSearchParam,
  useListUrlState,
} from "@/hooks/use-list-url-state";
import {
  getBannerHref,
  PUBLIC_BANNER_TARGETS,
} from "@/lib/banner";
import {
  adoptionSearchSchema,
  type AdoptionSearchSchema,
} from "@/lib/schemas/adoption-search";
import petService from "@/services/pet/pet";

function getPaginationItems(current: number, total: number, maxButtons = 5) {
  if (total <= maxButtons) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, current - half);
  const end = Math.min(total, start + maxButtons - 1);

  if (end - start + 1 < maxButtons) {
    start = Math.max(1, end - maxButtons + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export default function AdoptionPage() {
  const { searchParams, page, size, setPage, setParams } = useListUrlState({
    defaultPage: 1,
    defaultSize: 8,
  });

  const searchName = getOptionalSearchParam(searchParams.get("q")) ?? "";
  const gender = getOptionalSearchParam(searchParams.get("gender")) ?? "ALL";
  const normalizedGender =
    gender === "MALE" || gender === "FEMALE" || gender === "UNKNOWN"
      ? gender
      : "ALL";

  const form = useForm<AdoptionSearchSchema>({
    resolver: zodResolver(adoptionSearchSchema),
    defaultValues: {
      searchName,
      gender: normalizedGender,
    },
  });
  const selectedGender = useWatch({
    control: form.control,
    name: "gender",
  });

  React.useEffect(() => {
    form.reset({
      searchName,
      gender: normalizedGender,
    });
  }, [form, normalizedGender, searchName]);

  const availablePetsQuery = useQuery({
    queryKey: ["available-pets", { page, size, searchName, gender }],
    queryFn: () =>
      petService.getAvailablePets({
        page: Math.max(page - 1, 0),
        size,
        searchName: searchName || undefined,
        gender: normalizedGender === "ALL" ? undefined : normalizedGender,
      }),
    placeholderData: (previousData) => previousData,
  });
  const activeBannersQuery = useActiveBanners(PUBLIC_BANNER_TARGETS.ADOPTION);
  const adoptionBanners = React.useMemo(
    () =>
      (activeBannersQuery.data ?? [])
        .filter((item) => item.targetPage === PUBLIC_BANNER_TARGETS.ADOPTION)
        .sort((left, right) => left.displayOrder - right.displayOrder),
    [activeBannersQuery.data],
  );

  const defaultBanner = React.useMemo(
    () => ({
      bannerId: "default",
      title: "Mở cửa trái tim cho một người bạn bốn chân đang chờ được yêu thương.",
      subtitle:
        "Khám phá danh sách thú cưng đang sẵn sàng nhận nuôi, lọc nhanh theo nhu cầu của bạn và bắt đầu hành trình đem một mái ấm mới đến cho các bé.",
      mediaUrl:
        "https://images.unsplash.com/photo-1517849845537-4d257902454a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600",
      linkUrl: "#pet-list",
      targetPage: PUBLIC_BANNER_TARGETS.ADOPTION,
      displayOrder: 0,
      isActive: true,
    } as any),
    [],
  );

  const banners = React.useMemo(
    () => (adoptionBanners.length > 0 ? adoptionBanners : [defaultBanner]),
    [adoptionBanners, defaultBanner],
  );

  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (banners.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [banners.length]);

  React.useEffect(() => {
    setCurrentIndex(0);
  }, [banners.length]);

  const normalizedIndex = banners.length > 0 ? currentIndex % banners.length : 0;
  const currentBanner = banners[normalizedIndex];
  const heroPrimaryHref = getBannerHref(currentBanner, "#pet-list");

  const pets = availablePetsQuery.data?.content ?? [];
  const totalPages = Math.max(availablePetsQuery.data?.totalPages ?? 1, 1);
  const currentPage =
    (availablePetsQuery.data?.page ?? Math.max(page - 1, 0)) + 1;
  const paginationItems = React.useMemo(
    () => getPaginationItems(currentPage, totalPages, 5),
    [currentPage, totalPages],
  );

  const onSubmit = form.handleSubmit((values) => {
    setParams({
      page: 1,
      q: values.searchName.trim(),
      gender: values.gender === "ALL" ? undefined : values.gender,
    });
  });

  const handleReset = () => {
    form.reset({
      searchName: "",
      gender: "ALL",
    });
    setParams({
      page: 1,
      q: undefined,
      gender: undefined,
    });
  };

  return (
    <div className="bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_16%,#fffaf5_100%)]">
      <section className="relative flex w-full items-center justify-center overflow-hidden min-h-[480px] bg-slate-950">
        {/* Background Image Carousel with Ken Burns zoom & Cross-fade */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentBanner.bannerId}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={currentBanner.mediaUrl || defaultBanner.mediaUrl}
                alt={currentBanner.title || "Adoption Campaign"}
                fill
                priority
                unoptimized
                className="object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto w-full px-6 max-w-7xl py-12 md:py-16">
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner.bannerId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col gap-4"
              >
                {/* Badge */}
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-orange-400 backdrop-blur-md">
                    <Sparkles size={14} className="animate-pulse" />
                    Adoption Campaign
                  </span>
                </div>

                {/* Title */}
                <h1 className="max-w-3xl whitespace-pre-line text-balance text-4xl font-black tracking-tight text-white md:text-6xl leading-tight">
                  {currentBanner.title}
                </h1>

                {/* Description */}
                <p className="max-w-2xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                  {currentBanner.subtitle}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-2xl bg-white px-6 text-slate-900 hover:bg-white/90 shadow-lg hover:shadow-orange-500/10"
                  >
                    <Link href={heroPrimaryHref}>
                      {currentBanner.bannerId !== "default" ? "Xem chiến dịch" : "Xem danh sách"}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-2xl border-white/30 bg-white/10 px-6 text-white backdrop-blur hover:bg-white/15 hover:border-white/50"
                  >
                    <Link href={APP_ROUTES.DONATION}>Ủng hộ trung tâm</Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Dots */}
            {banners.length > 1 && (
              <div className="flex items-center gap-2.5 mt-2">
                {banners.map((item, index) => (
                  <button
                    key={item.bannerId}
                    type="button"
                    aria-label={`Xem banner ${index + 1}`}
                    onClick={() => setCurrentIndex(index)}
                    className="group relative h-3 rounded-full transition-all focus:outline-none"
                    style={{ width: index === normalizedIndex ? "32px" : "12px" }}
                  >
                    <span
                      className={cn(
                        "absolute inset-0 rounded-full transition-all duration-300",
                        index === normalizedIndex
                          ? "bg-gradient-to-r from-orange-500 to-amber-400"
                          : "bg-white/30 group-hover:bg-white/60"
                      )}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Bottom cards */}
            <div className="mt-8 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-orange-500/40 hover:bg-white/10"
              >
                <div className="flex items-center gap-3 text-orange-300 transition-colors group-hover:text-orange-400">
                  <div className="rounded-lg bg-orange-500/10 p-2 group-hover:bg-orange-500/20">
                    <PawPrint size={18} />
                  </div>
                  <span className="text-sm font-semibold tracking-wide text-white">Sẵn sàng nhận nuôi</span>
                </div>
                <p className="mt-3 text-3xl font-black text-white tracking-tight">
                  {availablePetsQuery.data?.totalElements ?? "--"}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-orange-500/40 hover:bg-white/10"
              >
                <div className="flex items-center gap-3 text-orange-300 transition-colors group-hover:text-orange-400">
                  <div className="rounded-lg bg-orange-500/10 p-2 group-hover:bg-orange-500/20">
                    <HeartHandshake size={18} />
                  </div>
                  <span className="text-sm font-semibold tracking-wide text-white">Quy trình minh bạch</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-200/90">
                  Lọc, theo dõi và sắp xếp theo từng nhu cầu nhận nuôi.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-orange-500/40 hover:bg-white/10"
              >
                <div className="flex items-center gap-3 text-orange-300 transition-colors group-hover:text-orange-400">
                  <div className="rounded-lg bg-orange-500/10 p-2 group-hover:bg-orange-500/20">
                    <Search size={18} />
                  </div>
                  <span className="text-sm font-semibold tracking-wide text-white">Tìm nhanh hơn</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-200/90">
                  Tìm theo tên và lọc theo giới tính chỉ trong một thao tác.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="pet-list" className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="rounded-[28px] border border-orange-100 bg-white/90 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
                Tìm thú cưng phù hợp
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                Danh sách thú cưng đang mở nhận nuôi
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Một bộ lọc đơn giản, một thanh tìm kiếm rõ ràng, và một danh
                sách card gọn gẽ để người dùng tập trung vào điều quan trọng
                nhất: chọn được bé phù hợp.
              </p>
            </div>
            <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm text-orange-700">
              Hiện có{" "}
              <span className="font-bold">
                {availablePetsQuery.data?.totalElements ?? 0}
              </span>{" "}
              bé đang sẵn sàng.
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-8">
            <FieldGroup className="gap-4 md:grid md:grid-cols-[1.8fr_0.9fr_auto_auto] md:items-end">
              <Field>
                <FieldLabel htmlFor="adoption-search">Search bar</FieldLabel>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="adoption-search"
                    placeholder="Tìm theo tên thú cưng..."
                    className="h-11 rounded-xl pl-10"
                    {...form.register("searchName")}
                  />
                </div>
                <FieldError errors={[form.formState.errors.searchName]} />
              </Field>

              <Field>
                <FieldLabel>Filter</FieldLabel>
                <Select
                  value={selectedGender}
                  onValueChange={(value) =>
                    form.setValue(
                      "gender",
                      value as AdoptionSearchSchema["gender"],
                    )
                  }
                >
                  <SelectTrigger className="h-11 w-full rounded-xl">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả giới tính</SelectItem>
                    <SelectItem value="MALE">Đực</SelectItem>
                    <SelectItem value="FEMALE">Cái</SelectItem>
                    <SelectItem value="UNKNOWN">Chưa rõ</SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Một filter duy nhất để giữ thao tác gọn.
                </FieldDescription>
              </Field>

              <Button type="submit" className="h-11 rounded-xl px-6">
                Áp dụng
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl px-6"
                onClick={handleReset}
              >
                Đặt lại
              </Button>
            </FieldGroup>
          </form>

          <div className="mt-8">
            {availablePetsQuery.isPending ? (
              <GridSkeleton cards={size} />
            ) : pets.length ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {pets.map((pet) => (
                  <PetCard key={pet.petId} pet={pet} />
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
                <p className="text-lg font-semibold text-slate-900">
                  Chưa tìm thấy thú cưng phù hợp
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Thử thỏa nỏi bộ lọc hoặc xóa từ khóa tìm kiếm để xem thêm các
                  bé khác.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-6 rounded-xl"
                  onClick={handleReset}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-500">
              Trang{" "}
              <span className="font-semibold text-slate-900">
                {currentPage}
              </span>
              /{totalPages}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                className="rounded-xl"
                disabled={currentPage <= 1}
                onClick={() => setPage(Math.max(1, currentPage - 1))}
              >
                Trước
              </Button>

              {paginationItems.map((item) => (
                <Button
                  key={item}
                  variant={item === currentPage ? "default" : "outline"}
                  className="min-w-10 rounded-xl"
                  onClick={() => setPage(item)}
                >
                  {item}
                </Button>
              ))}

              <Button
                variant="outline"
                className="rounded-xl"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              >
                Sau
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
