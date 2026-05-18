"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  HeartHandshake,
  MapPin,
  PawPrint,
  ShieldPlus,
  Stethoscope,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { APP_ROUTES } from "@/constants/routes";
import { useCurrentUser } from "@/hooks/use-current-user";
import adoptionService from "@/services/adoption/adoption";
import petService, { petDetailsService } from "@/services/pet/pet";
import {
  adoptionRequestSchema,
  type AdoptionRequestSchema,
} from "@/lib/schemas/adoption-request";
import { getAuthErrorMessage } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600";

function formatDateVi(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getGenderLabel(gender?: string) {
  switch (gender) {
    case "MALE":
      return "Duc";
    case "FEMALE":
      return "Cai";
    default:
      return "Chua ro";
  }
}

function getHealthLabel(status?: string) {
  switch (status) {
    case "HEALTHY":
      return "Khoe manh";
    case "UNDER_TREATMENT":
      return "Dang dieu tri";
    case "RECOVERING":
      return "Dang hoi phuc";
    case "SPECIAL_NEEDS":
      return "Can cham soc dac biet";
    default:
      return status || "Dang cap nhat";
  }
}

export default function AdoptionPetDetailPage() {
  const params = useParams<{ petId: string }>();
  const petId = params?.petId;
  const router = useRouter();
  const currentUserQuery = useCurrentUser();

  const petQuery = useQuery({
    queryKey: ["public-pet-detail", petId],
    queryFn: () => petService.getPetById(petId as string),
    enabled: Boolean(petId),
  });

  const medicalRecordsQuery = useQuery({
    queryKey: ["public-pet-medical-records", petId],
    queryFn: () =>
      petDetailsService.getMedicalRecords(petId as string, {
        petId: petId as string,
        page: 0,
        size: 3,
      }),
    enabled: Boolean(petId),
  });

  const form = useForm<AdoptionRequestSchema>({
    resolver: zodResolver(adoptionRequestSchema),
    defaultValues: {
      experience: "",
      liveCondition: "",
    },
  });

  const createAdoptionMutation = useMutation({
    mutationFn: adoptionService.createAdoption,
  });

  const [submitSuccessMessage, setSubmitSuccessMessage] = React.useState<
    string | null
  >(null);

  const pet = petQuery.data;
  const medicalRecords = medicalRecordsQuery.data?.content ?? [];
  const organizationId = pet?.organization?.organizationId;

  const onSubmit = form.handleSubmit(async (values) => {
    form.clearErrors("root");
    setSubmitSuccessMessage(null);

    if (!currentUserQuery.data) {
      form.setError("root", {
        type: "server",
        message: "Ban can dang nhap truoc khi gui don nhan nuoi.",
      });
      return;
    }

    if (!petId || !organizationId) {
      form.setError("root", {
        type: "server",
        message: "Khong du thong tin to chuc de tao don nhan nuoi.",
      });
      return;
    }

    try {
      await createAdoptionMutation.mutateAsync({
        petId,
        organizationId,
        experience: values.experience.trim(),
        liveCondition: values.liveCondition.trim(),
      });

      setSubmitSuccessMessage(
        "Don nhan nuoi da duoc gui thanh cong. Trung tam se lien he voi ban som.",
      );
      form.reset();
    } catch (error) {
      form.setError("root", {
        type: "server",
        message: getAuthErrorMessage(error, "Gui don nhan nuoi that bai."),
      });
    }
  });

  if (petQuery.isPending) {
    return <AdoptionPetDetailSkeleton />;
  }

  if (petQuery.isError || !pet) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => router.push(APP_ROUTES.ADOPTION)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lai danh sach
        </Button>
        <Card className="mt-6 rounded-[28px] border-slate-200">
          <CardContent className="p-10 text-center">
            <p className="text-lg font-semibold text-slate-900">
              Khong tim thay thong tin thu cung
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Be co the da duoc cap nhat hoac tam thoi khong con san sang nhan nuoi.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_22%,#f8fafc_100%)]">
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => router.push(APP_ROUTES.ADOPTION)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lai danh sach nhan nuoi
        </Button>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.55fr_0.95fr]">
          <div className="space-y-8">
            <Card className="overflow-hidden rounded-[32px] border-0 shadow-[0_28px_80px_rgba(15,23,42,0.10)]">
              <div className="relative h-[420px] bg-slate-100">
                <Image
                  src={pet.imageUrls[0] || IMAGE_FALLBACK}
                  alt={pet.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/15 to-transparent" />

                <div className="absolute left-6 top-6 flex flex-wrap gap-2">
                  {pet.vaccinated ? (
                    <Badge className="rounded-full bg-emerald-500 text-white hover:bg-emerald-500">
                      Da tiem vaccine
                    </Badge>
                  ) : null}
                  {pet.neutered ? (
                    <Badge className="rounded-full bg-sky-500 text-white hover:bg-sky-500">
                      Da triet san
                    </Badge>
                  ) : null}
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="rounded-full bg-white/18 text-white backdrop-blur hover:bg-white/18">
                      {pet.species}
                    </Badge>
                    <Badge className="rounded-full bg-white/18 text-white backdrop-blur hover:bg-white/18">
                      {pet.breed || "Dang cap nhat"}
                    </Badge>
                    <Badge className="rounded-full bg-white/18 text-white backdrop-blur hover:bg-white/18">
                      {getGenderLabel(pet.gender)}
                    </Badge>
                  </div>

                  <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
                    {pet.name}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
                    {pet.description || "Be dang tim mot gia dinh moi, an toan va day yeu thuong."}
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <InfoCard
                icon={<PawPrint className="h-5 w-5 text-orange-500" />}
                label="Tuoi"
                value={pet.ageDisplay || `${pet.age} thang`}
              />
              <InfoCard
                icon={<ShieldPlus className="h-5 w-5 text-emerald-500" />}
                label="Suc khoe"
                value={getHealthLabel(pet.healthStatus)}
              />
              <InfoCard
                icon={<MapPin className="h-5 w-5 text-sky-500" />}
                label="Khu vuc"
                value={pet.rescueLocation || pet.province || "Dang cap nhat"}
              />
            </div>

            <Card className="rounded-[28px] border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
              <CardHeader className="pb-0">
                <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                  Thong tin thu cung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <DetailRow label="Ma thu cung" value={pet.petCode || pet.petId} />
                  <DetailRow
                    label="Can nang"
                    value={pet.weight ? `${pet.weight} kg` : "Dang cap nhat"}
                  />
                  <DetailRow label="Mau sac" value={pet.color || "Dang cap nhat"} />
                  <DetailRow
                    label="To chuc quan ly"
                    value={pet.organization?.name || "Cong dong"}
                  />
                  <DetailRow
                    label="Chu so huu hien tai"
                    value={pet.owner?.name || "Dang cap nhat"}
                  />
                  <DetailRow
                    label="Ngay tiep nhan"
                    value={formatDateVi(pet.rescueDate)}
                  />
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Mo ta
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {pet.description || "Thong tin mo ta dang duoc cap nhat bo sung."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-900">
                  <Stethoscope className="h-6 w-6 text-primary" />
                  Lich su y te gan day
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {medicalRecordsQuery.isPending ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20 rounded-2xl" />
                    <Skeleton className="h-20 rounded-2xl" />
                    <Skeleton className="h-20 rounded-2xl" />
                  </div>
                ) : medicalRecords.length ? (
                  <div className="space-y-4">
                    {medicalRecords.map((record) => (
                      <div
                        key={record.recordId}
                        className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {record.diagnosis || "Thong tin chan doan dang cap nhat"}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                              {record.vaccine || "Khong co vaccine"} • {formatDateVi(record.recordDate)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <CalendarDays className="h-4 w-4" />
                            {record.createdBy || "He thong"}
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {record.description || "Chua co ghi chu bo sung cho lan kham nay."}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                    Chua co du lieu y te de hien thi cho thu cung nay.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-[28px] border-0 bg-[linear-gradient(180deg,#082f49_0%,#0f172a_100%)] text-white shadow-[0_28px_90px_rgba(8,47,73,0.28)]">
              <CardContent className="p-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
                  <HeartHandshake className="h-3.5 w-3.5" />
                  Form nhan nuoi
                </div>

                <h2 className="mt-4 text-3xl font-black tracking-tight">
                  Dang ky don nhan nuoi cho {pet.name}
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/74">
                  Dien thong tin trung thuc de trung tam danh gia kha nang cham soc
                  va ket noi voi ban nhanh hon.
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
                  {pet.organization?.name
                    ? `Don se duoc gui den ${pet.organization.name}.`
                    : "Don se duoc gui den don vi dang quan ly thu cung nay."}
                </div>

                {!currentUserQuery.data ? (
                  <div className="mt-6 space-y-3">
                    <p className="text-sm text-amber-200">
                      Ban can dang nhap de gui don nhan nuoi.
                    </p>
                    <Button asChild className="w-full rounded-2xl bg-white text-slate-900 hover:bg-white/90">
                      <Link href={APP_ROUTES.LOGIN}>Dang nhap de tiep tuc</Link>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="mt-6">
                    <FieldGroup className="gap-5">
                      {form.formState.errors.root?.message ? (
                        <FieldError>{form.formState.errors.root.message}</FieldError>
                      ) : null}

                      {submitSuccessMessage ? (
                        <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                          {submitSuccessMessage}
                        </div>
                      ) : null}

                      <Field>
                        <FieldLabel htmlFor="experience" className="text-white">
                          Kinh nghiem cham soc thu cung
                        </FieldLabel>
                        <Textarea
                          id="experience"
                          rows={5}
                          className="min-h-32 w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/30 focus:ring-2 focus:ring-white/20"
                          placeholder="Mo ta kinh nghiem cham soc, dieu ban da tung lam, cach ban xu ly khi thu cung om..."
                          {...form.register("experience")}
                        />
                        <FieldError errors={[form.formState.errors.experience]} />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="liveCondition" className="text-white">
                          Dieu kien song va moi truong nuoi
                        </FieldLabel>
                        <Textarea
                          id="liveCondition"
                          rows={5}
                          className="min-h-32 w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/30 focus:ring-2 focus:ring-white/20"
                          placeholder="Chia se ve khong gian song, lich sinh hoat, thanh vien gia dinh, kha nang cham soc lau dai..."
                          {...form.register("liveCondition")}
                        />
                        <FieldError errors={[form.formState.errors.liveCondition]} />
                        <FieldDescription className="text-white/60">
                          Hai truong nay giup trung tam danh gia do phu hop nhanh hon.
                        </FieldDescription>
                      </Field>

                      <Button
                        type="submit"
                        className="h-12 rounded-2xl bg-white text-slate-900 hover:bg-white/90"
                        disabled={createAdoptionMutation.isPending}
                      >
                        {createAdoptionMutation.isPending
                          ? "Dang gui don..."
                          : "Gui don nhan nuoi"}
                      </Button>
                    </FieldGroup>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="rounded-[24px] border-slate-200 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
      <CardContent className="flex items-start gap-4 p-5">
        <div className="rounded-2xl bg-slate-50 p-3">{icon}</div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-base font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function AdoptionPetDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Skeleton className="h-10 w-52 rounded-xl" />
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.55fr_0.95fr]">
        <div className="space-y-8">
          <Skeleton className="h-[420px] rounded-[32px]" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Skeleton className="h-28 rounded-[24px]" />
            <Skeleton className="h-28 rounded-[24px]" />
            <Skeleton className="h-28 rounded-[24px]" />
          </div>
          <Skeleton className="h-72 rounded-[28px]" />
          <Skeleton className="h-80 rounded-[28px]" />
        </div>
        <div>
          <Skeleton className="h-[620px] rounded-[28px]" />
        </div>
      </div>
    </div>
  );
}
