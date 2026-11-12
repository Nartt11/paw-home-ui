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
  CheckCircle2,
  Info,
  Phone,
  Heart,
  FileText,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
      return "Đực";
    case "FEMALE":
      return "Cái";
    default:
      return "Chưa rõ";
  }
}

function getHealthLabel(status?: string) {
  switch (status) {
    case "HEALTHY":
      return "Khỏe mạnh";
    case "UNDER_TREATMENT":
      return "Đang điều trị";
    case "RECOVERING":
      return "Đang hồi phục";
    case "SPECIAL_NEEDS":
      return "Cần chăm sóc đặc biệt";
    default:
      return status || "Đang cập nhật";
  }
}

function getPetStatusLabel(status?: string) {
  switch (status) {
    case "AVAILABLE":
      return "Sẵn sàng nhận nuôi";
    case "LOST":
      return "Đang thất lạc";
    case "ADOPTED":
      return "Đã được nhận nuôi";
    case "FOSTERING":
      return "Đang được nuôi tạm";
    case "DECEASED":
      return "Đã mất";
    default:
      return "Đang cập nhật";
  }
}

function getPetStatusBadgeClass(status?: string) {
  switch (status) {
    case "AVAILABLE":
      return "bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-600";
    case "LOST":
      return "bg-amber-500 text-white hover:bg-amber-600 border-amber-600";
    case "ADOPTED":
      return "bg-sky-500 text-white hover:bg-sky-600 border-sky-600";
    case "FOSTERING":
      return "bg-indigo-500 text-white hover:bg-indigo-600 border-indigo-600";
    case "DECEASED":
      return "bg-slate-500 text-white hover:bg-slate-600 border-slate-600";
    default:
      return "bg-slate-500 text-white hover:bg-slate-600 border-slate-600";
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
        pageSize: 3,
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

  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const pet = petQuery.data;
  const medicalRecords = medicalRecordsQuery.data?.content ?? [];
  const organizationId = pet?.organization?.organizationId;

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSubmitSuccessMessage(null);
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    form.clearErrors("root");
    setSubmitSuccessMessage(null);

    if (!currentUserQuery.data) {
      form.setError("root", {
        type: "server",
        message: "Bạn cần đăng nhập trước khi gửi đơn nhận nuôi.",
      });
      return;
    }

    if (!petId || !organizationId) {
      form.setError("root", {
        type: "server",
        message: "Không đủ thông tin tổ chức để tạo đơn nhận nuôi.",
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
        "Đơn nhận nuôi đã được gửi thành công. Trung tâm sẽ liên hệ với bạn sớm.",
      );
      toast.success("Gửi đơn nhận nuôi thành công!");
      form.reset();
    } catch (error) {
      form.setError("root", {
        type: "server",
        message: getAuthErrorMessage(error, "Gửi đơn nhận nuôi thất bại."),
      });
      toast.error("Gửi đơn nhận nuôi thất bại. Vui lòng thử lại.");
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
          Quay lại danh sách
        </Button>
        <Card className="mt-6 rounded-[28px] border-slate-200">
          <CardContent className="p-10 text-center">
            <p className="text-lg font-semibold text-slate-900">
              Không tìm thấy thông tin thú cưng
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Bé có thể đã được cập nhật hoặc tạm thời không còn sẵn sàng nhận
              nuôi.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const imageUrls = pet.imageUrls && pet.imageUrls.length > 0 ? pet.imageUrls : [IMAGE_FALLBACK];
  const isAdoptable = pet.status === "AVAILABLE";

  return (
    <div className="bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_22%,#f8fafc_100%)]">
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <Button
          variant="outline"
          className="rounded-xl hover:bg-slate-100 transition-colors"
          onClick={() => router.push(APP_ROUTES.ADOPTION)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách nhận nuôi
        </Button>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.55fr_0.95fr]">
          <div className="space-y-8">
            {/* Image Gallery Card */}
            <Card className="overflow-hidden rounded-[32px] border-0 shadow-[0_28px_80px_rgba(15,23,42,0.10)] bg-white">
              <div className="relative h-[420px] bg-slate-100 overflow-hidden">
                <Image
                  src={imageUrls[activeImageIndex] || IMAGE_FALLBACK}
                  alt={pet.name}
                  fill
                  unoptimized
                  className="object-cover transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent" />

                {/* Badges */}
                <div className="absolute left-6 top-6 flex flex-wrap gap-2 z-10">
                  {pet.vaccinated ? (
                    <Badge className="rounded-full bg-emerald-500 text-white hover:bg-emerald-600 font-semibold px-2.5 py-0.5">
                      Đã tiêm vaccine
                    </Badge>
                  ) : null}
                  {pet.neutered ? (
                    <Badge className="rounded-full bg-sky-500 text-white hover:bg-sky-600 font-semibold px-2.5 py-0.5">
                      Đã triệt sản
                    </Badge>
                  ) : null}
                </div>

                <div className="absolute right-6 top-6 z-10">
                  <Badge className={cn("rounded-full font-semibold px-3 py-1 text-xs shadow-md border", getPetStatusBadgeClass(pet.status))}>
                    {getPetStatusLabel(pet.status)}
                  </Badge>
                </div>

                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 border border-white/10 font-medium px-2.5 py-0.5">
                      {pet.species}
                    </Badge>
                    <Badge className="rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 border border-white/10 font-medium px-2.5 py-0.5">
                      {pet.breed || "Đang cập nhật"}
                    </Badge>
                    <Badge className="rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 border border-white/10 font-medium px-2.5 py-0.5">
                      {getGenderLabel(pet.gender)}
                    </Badge>
                  </div>

                  <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl drop-shadow-sm">
                    {pet.name}
                  </h1>
                </div>
              </div>

              {/* Thumbnail Selector */}
              {imageUrls.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-4 pt-4 px-6 border-t border-slate-100 bg-slate-50/50">
                  {imageUrls.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={cn(
                        "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all hover:opacity-90",
                        idx === activeImageIndex
                          ? "border-orange-500 ring-4 ring-orange-500/10 scale-95"
                          : "border-slate-200"
                      )}
                    >
                      <Image
                        src={url}
                        alt={`${pet.name} - ảnh ${idx + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Quick Highlights Grid */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <InfoCard
                icon={<PawPrint className="h-5 w-5 text-orange-500" />}
                label="Tuổi"
                value={pet.ageDisplay || `${pet.age} tháng`}
              />
              <InfoCard
                icon={<ShieldPlus className="h-5 w-5 text-emerald-500" />}
                label="Sức khỏe"
                value={getHealthLabel(pet.healthStatus)}
              />
              <InfoCard
                icon={<MapPin className="h-5 w-5 text-sky-500" />}
                label="Khu vực"
                value={pet.rescueLocation || pet.province || "Đang cập nhật"}
              />
            </div>

            {/* Technical Information Details Card */}
            <Card className="rounded-[28px] border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.06)] bg-white">
              <CardHeader className="pb-0">
                <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                  Thông tin chi tiết
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                  <DetailRow
                    label="Mã thú cưng"
                    value={pet.petCode || "Chưa cập nhật"}
                  />
                  <DetailRow
                    label="Loài"
                    value={pet.species}
                  />
                  <DetailRow
                    label="Giống"
                    value={pet.breed || "Đang cập nhật"}
                  />
                  <DetailRow
                    label="Giới tính"
                    value={getGenderLabel(pet.gender)}
                  />
                  <DetailRow
                    label="Cân nặng"
                    value={pet.weight ? `${pet.weight} kg` : "Đang cập nhật"}
                  />
                  <DetailRow
                    label="Màu sắc"
                    value={pet.color || "Đang cập nhật"}
                  />
                  <DetailRow
                    label="Nơi cứu hộ"
                    value={pet.rescueLocation || "Đang cập nhật"}
                  />
                  <DetailRow
                    label="Ngày tiếp nhận"
                    value={formatDateVi(pet.rescueDate)}
                  />
                  <DetailRow
                    label="Tỉnh / Thành"
                    value={pet.province || "Đang cập nhật"}
                  />
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Mô tả
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600 whitespace-pre-line">
                    {pet.description ||
                      "Thông tin mô tả đang được cập nhật bổ sung."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Medical Records Card */}
            <Card className="rounded-[28px] border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.06)] bg-white">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-900">
                  <Stethoscope className="h-6 w-6 text-primary" />
                  Lịch sử y tế gần đây
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
                              {record.diagnosis ||
                                "Thông tin chẩn đoán đang cập nhật"}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                              {record.vaccine || "Không có vaccine"} •{" "}
                              {formatDateVi(record.recordDate)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <CalendarDays className="h-4 w-4" />
                            {record.createdBy || "Hệ thống"}
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {record.description ||
                            "Chưa có ghi chú bổ sung cho lần khám này."}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                    Chưa có dữ liệu y tế để hiển thị cho thú cưng này.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Adoption Action Card */}
            <Card className="rounded-[28px] border-0 bg-[linear-gradient(180deg,#082f49_0%,#0f172a_100%)] text-white shadow-[0_28px_90px_rgba(8,47,73,0.28)] overflow-hidden">
              <CardContent className="p-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
                  <Heart className="h-3.5 w-3.5 fill-current text-rose-400" />
                  Nhận nuôi thú cưng
                </div>

                <h2 className="mt-4 text-3xl font-black tracking-tight">
                  Mang {pet.name} về nhà
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/75">
                  Mỗi bé tại trạm cứu hộ đều đang mong chờ một tổ ấm trọn vẹn và an lành. Hãy mở rộng vòng tay để đón nhận một tình yêu vô điều kiện.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-400"></span>
                      Trạng thái: <strong>{getPetStatusLabel(pet.status)}</strong>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-400"></span>
                      Đơn vị quản lý: <strong>{pet.organization?.name || "Cộng đồng"}</strong>
                    </p>
                  </div>

                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    disabled={!isAdoptable}
                    className={cn(
                      "w-full h-12 rounded-2xl text-base font-bold shadow-lg transition-all",
                      isAdoptable
                        ? "bg-white text-slate-900 hover:bg-slate-100 hover:shadow-orange-500/10 cursor-pointer"
                        : "bg-white/20 text-white/50 border border-white/10 cursor-not-allowed"
                    )}
                  >
                    {isAdoptable ? "Nhận nuôi ngay" : "Hiện không thể nhận nuôi"}
                  </Button>

                  {!isAdoptable && (
                    <p className="text-xs text-center text-white/60">
                      Bé hiện đã có chủ hoặc tạm thời không thể nhận nuôi tại thời điểm này.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Caretaker / Organization Card */}
            {pet.organization ? (
              <Card className="rounded-[28px] border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.06)] bg-white overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ShieldPlus className="h-5 w-5 text-primary" />
                    Đơn vị bảo trợ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    {pet.organization.imageUrl ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-100">
                        <Image
                          src={pet.organization.imageUrl}
                          alt={pet.organization.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-lg">
                        {pet.organization.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {pet.organization.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {pet.organization.type === "SHELTER" ? "Trạm cứu hộ" : "Phòng khám thú y"}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm text-slate-600">
                    {pet.organization.phone && (
                      <p className="flex items-center gap-2">
                        <span className="font-semibold text-slate-400">SĐT liên hệ:</span> {pet.organization.phone}
                      </p>
                    )}
                    {pet.organization.email && (
                      <p className="flex items-center gap-2">
                        <span className="font-semibold text-slate-400">Email:</span> {pet.organization.email}
                      </p>
                    )}
                    {(pet.organization.streetAddress || pet.organization.provinceName) && (
                      <p className="flex items-start gap-2">
                        <span className="font-semibold text-slate-400 flex-shrink-0">Địa chỉ:</span> 
                        <span>
                          {[
                            pet.organization.streetAddress,
                            pet.organization.wardName,
                            pet.organization.provinceName,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : pet.owner ? (
              <Card className="rounded-[28px] border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.06)] bg-white overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <HeartHandshake className="h-5 w-5 text-primary" />
                    Người chăm sóc hiện tại
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    {pet.owner.avatarUrl ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-100">
                        <Image
                          src={pet.owner.avatarUrl}
                          alt={pet.owner.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600 font-bold text-lg">
                        {pet.owner.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {pet.owner.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Chủ sở hữu
                      </p>
                    </div>
                  </div>
                  
                  {pet.owner.caretakerName && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-3">
                        {pet.owner.caretakerAvatarUrl ? (
                          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-100">
                            <Image
                              src={pet.owner.caretakerAvatarUrl}
                              alt={pet.owner.caretakerName}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">
                            {pet.owner.caretakerName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            Người liên hệ: {pet.owner.caretakerName}
                          </h4>
                          <p className="text-[10px] text-slate-500">
                            Người chăm sóc trực tiếp
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm text-slate-600">
                    {pet.owner.phone && (
                      <p className="flex items-center gap-2">
                        <span className="font-semibold text-slate-400">SĐT liên hệ:</span> {pet.owner.phone}
                      </p>
                    )}
                    {pet.owner.caretakerPhone && pet.owner.caretakerPhone !== pet.owner.phone && (
                      <p className="flex items-center gap-2">
                        <span className="font-semibold text-slate-400">SĐT Caretaker:</span> {pet.owner.caretakerPhone}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>

      {/* Adoption Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6 overflow-hidden bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-orange-500" />
              Đăng ký nhận nuôi {pet.name}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Điền thông tin trung thực để trung tâm đánh giá mức độ phù hợp và phản hồi bạn nhanh nhất có thể.
            </DialogDescription>
          </DialogHeader>

          {!currentUserQuery.data ? (
            <div className="mt-4 space-y-4 py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 mx-auto">
                <Info className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">Yêu cầu đăng nhập</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Bạn cần đăng nhập tài khoản trước khi có thể gửi đơn ứng tuyển nhận nuôi bé.
                </p>
              </div>
              <Button
                asChild
                className="mt-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 px-6 h-11"
              >
                <Link href={APP_ROUTES.LOGIN}>Đăng nhập ngay</Link>
              </Button>
            </div>
          ) : submitSuccessMessage ? (
            <div className="mt-4 flex flex-col items-center justify-center py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <CheckCircle2 className="h-8 w-8 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Gửi đơn thành công!</h3>
              <p className="mt-2 text-sm text-slate-600 max-w-sm">
                {submitSuccessMessage}
              </p>
              <Button
                onClick={() => setIsDialogOpen(false)}
                className="mt-6 rounded-xl px-6 h-10 bg-slate-900 text-white hover:bg-slate-800"
              >
                Đóng cửa sổ
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-4 space-y-5">
              <FieldGroup className="gap-5">
                {form.formState.errors.root?.message ? (
                  <FieldError>
                    {form.formState.errors.root.message}
                  </FieldError>
                ) : null}

                <Field>
                  <FieldLabel htmlFor="experience" className="text-slate-700 font-semibold">
                    Kinh nghiệm chăm sóc thú cưng
                  </FieldLabel>
                  <Textarea
                    id="experience"
                    rows={4}
                    className="min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    placeholder="Mô tả kinh nghiệm chăm sóc thú cưng của bạn (ít nhất 20 ký tự)..."
                    {...form.register("experience")}
                  />
                  <FieldError
                    errors={[form.formState.errors.experience]}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="liveCondition" className="text-slate-700 font-semibold">
                    Điều kiện sống và môi trường nuôi
                  </FieldLabel>
                  <Textarea
                    id="liveCondition"
                    rows={4}
                    className="min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    placeholder="Không gian sống, lịch làm việc, thành viên gia đình, sự đồng thuận nuôi bé..."
                    {...form.register("liveCondition")}
                  />
                  <FieldError
                    errors={[form.formState.errors.liveCondition]}
                  />
                  <FieldDescription className="text-xs text-slate-400 mt-1">
                    Các thông tin này giúp tổ chức đánh giá nhanh chóng mức độ thích hợp của môi trường nuôi dưỡng.
                  </FieldDescription>
                </Field>

                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-xl px-5 h-11 border-slate-200 hover:bg-slate-50"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    className="h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold px-6"
                    disabled={createAdoptionMutation.isPending}
                  >
                    {createAdoptionMutation.isPending
                      ? "Đang gửi..."
                      : "Gửi đơn đăng ký"}
                  </Button>
                </div>
              </FieldGroup>
            </form>
          )}
        </DialogContent>
      </Dialog>
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
    <Card className="rounded-[24px] border-slate-200 shadow-[0_18px_50px_rgba(15,23,42,0.05)] bg-white">
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
