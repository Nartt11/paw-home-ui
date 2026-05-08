/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  ArrowLeft,
  ArrowRightLeft,
  Building2,
  Calendar,
  ChevronRight,
  Edit2,
  Eye,
  History,
  Image as ImageIcon,
  MapPin,
  Plus,
  ShieldAlert,
  Stethoscope,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import petService from "@/services/pet/pet";
import type { Pet } from "@/types/pet.type";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";

// -------- helpers --------
function formatDateVi(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTimeVi(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function genderLabel(g?: Pet["gender"]) {
  if (!g) return "—";
  const map: Record<string, string> = {
    MALE: "Đực",
    FEMALE: "Cái",
    UNKNOWN: "Không rõ",
  };
  return map[g] ?? String(g);
}

function petStatusLabel(s?: Pet["status"]) {
  if (!s) return "—";
  const map: Record<string, string> = {
    UNOWNED: "Chưa có chủ",
    PENDING: "Đang chờ",
    ADOPTED: "Đã nhận nuôi",
    FOSTERED: "Đang foster",
    UNAVAILABLE: "Không khả dụng",
  };
  return map[s] ?? String(s);
}

function healthStatusLabel(s?: Pet["healthStatus"]) {
  if (!s) return "—";
  const map: Record<string, string> = {
    HEALTHY: "Khoẻ mạnh",
    UNDER_TREATMENT: "Đang điều trị",
    RECOVERING: "Đang hồi phục",
    SPECIAL_NEEDS: "Cần chăm sóc đặc biệt",
  };
  return map[s] ?? String(s);
}

function pillVariantForPetStatus(status?: Pet["status"]) {
  const s = status ?? "PENDING";
  if (s === "UNOWNED") return { className: "bg-emerald-50 text-emerald-700" };
  if (s === "PENDING") return { className: "bg-amber-50 text-amber-700" };
  if (s === "ADOPTED") return { className: "bg-sky-50 text-sky-700" };
  if (s === "FOSTERED") return { className: "bg-violet-50 text-violet-700" };
  return { className: "bg-muted text-muted-foreground" };
}

function pillVariantForHealth(status?: Pet["healthStatus"]) {
  const s = status ?? "HEALTHY";
  if (s === "HEALTHY") return { className: "bg-emerald-50 text-emerald-700" };
  if (s === "UNDER_TREATMENT")
    return { className: "bg-amber-50 text-amber-700" };
  if (s === "RECOVERING") return { className: "bg-sky-50 text-sky-700" };
  if (s === "SPECIAL_NEEDS") return { className: "bg-rose-50 text-rose-700" };
  return { className: "bg-muted text-muted-foreground" };
}

// -------- page --------
export default function PetDetailPage() {
  const params = useParams<{ petId: string }>();
  const petId = params?.petId;
  const router = useRouter();

  const petQuery = useQuery({
    queryKey: ["pet", petId],
    queryFn: () => petService.getPetById(petId as string),
    enabled: Boolean(petId),
  });

  const pet = (petQuery.data ?? null) as Pet | null;

  const [activeTab, setActiveTab] = React.useState<
    "medical" | "media" | "logs"
  >("medical");

  if (petQuery.isPending) return <PetDetailSkeleton />;
  if (petQuery.isError) {
    return (
      <div className="space-y-3">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-xl"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="rounded-lg border border-border bg-card p-4 text-sm">
          Không tải được dữ liệu thú cưng.
        </div>
      </div>
    );
  }

  if (!pet) return <div>Pet not found</div>;

  const coverUrl =
    pet.imageUrls ||
    (Array.isArray((pet as any).imageUrls)
      ? (pet as any).imageUrls?.[0]
      : null);

  const orgName =
    (pet as any).organizationName ??
    (pet as any).organization?.name ??
    (pet as any).shelterName ??
    "—";
  const orgId =
    (pet as any).organizationId ?? (pet as any).organization?.id ?? "—";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-serif font-bold text-foreground">
                {pet.name ?? "—"}
              </h1>
              <Badge
                variant="outline"
                className="h-6 px-3 text-[10px] font-bold uppercase tracking-widest"
              >
                {pet.petCode ?? pet.petId ?? petId}
              </Badge>
            </div>

            <p className="mt-1 flex items-center gap-2 font-medium text-muted-foreground">
              {pet.species ?? "—"} • {pet.breed ?? "—"} •{" "}
              {pet.ageDisplay ?? "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-11 rounded-xl border-border px-6 font-bold text-muted-foreground"
            onClick={() => {
              toast("Chức năng chia sẻ đang được phát triển");
            }}
          >
            Chia sẻ hồ sơ
          </Button>

          <Button
            className="h-11 rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
            onClick={() => {
              toast("Chức năng chỉnh sửa đang được phát triển");
            }}
          >
            <Edit2 className="mr-2 h-4 w-4" /> Chỉnh sửa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-2">
          {/* Hero Card */}
          <Card className="group overflow-hidden border-none shadow-xl shadow-primary/5">
            <CardContent className="relative aspect-[21/9] p-0">
              <Image
                src={pet.imageUrls[0]}
                alt={pet.name ?? "pet"}
                width={1200}
                height={514}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div className="flex gap-2">
                  <Badge
                    className={cn(
                      "rounded-full border-white/20 bg-white/20 px-4 py-1.5 font-bold text-white backdrop-blur-md hover:bg-white/20",
                      "uppercase",
                    )}
                  >
                    {petStatusLabel(pet.status)}
                  </Badge>
                  <Badge
                    className={cn(
                      "rounded-full border-white/20 bg-white/20 px-4 py-1.5 font-bold text-white backdrop-blur-md hover:bg-white/20",
                      "uppercase",
                    )}
                  >
                    {healthStatusLabel(pet.healthStatus)}
                  </Badge>
                </div>

                <Button
                  className="rounded-xl bg-white font-bold text-primary shadow-xl hover:bg-white/90"
                  onClick={() => toast("Upload ảnh đang được phát triển")}
                >
                  <Upload className="mr-2 h-4 w-4" /> Đổi ảnh bìa
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info Card */}
          <Card className="border-none shadow-xl shadow-primary/5">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="flex items-center gap-2 text-xl font-serif font-bold">
                <Activity className="h-5 w-5 text-primary" /> Thông tin cơ bản
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-x-12 gap-y-8 md:grid-cols-3">
                <InfoItem label="Tên gọi" value={pet.name ?? "—"} />
                <InfoItem label="Pet code" value={pet.petCode ?? "—"} />
                <InfoItem label="Pet ID" value={pet.petId ?? petId ?? "—"} />

                <InfoItem label="Loài" value={pet.species ?? "—"} />
                <InfoItem label="Giống" value={pet.breed ?? "—"} />
                <InfoItem label="Tuổi" value={pet.ageDisplay ?? "—"} />

                <InfoItem label="Giới tính" value={genderLabel(pet.gender)} />

                <InfoItem
                  label="Tiêm phòng"
                  value={pet.vaccinated ? "Đã tiêm" : "Chưa tiêm"}
                  isBadge
                  badgeClassName={
                    pet.vaccinated
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                      : "bg-muted text-muted-foreground hover:bg-muted"
                  }
                />

                <InfoItem
                  label="Trạng thái"
                  value={petStatusLabel(pet.status)}
                  isBadge
                  badgeClassName={pillVariantForPetStatus(pet.status).className}
                />

                <InfoItem
                  label="Sức khỏe"
                  value={healthStatusLabel(pet.healthStatus)}
                  isBadge
                  badgeClassName={
                    pillVariantForHealth(pet.healthStatus).className
                  }
                />

                <InfoItem
                  label="Ngày tạo"
                  value={formatDateTimeVi((pet as any).createdAt)}
                />
                <InfoItem
                  label="Cập nhật"
                  value={formatDateTimeVi((pet as any).updatedAt)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Internal Notes Card */}
          <Card className="border-l-4 border-primary bg-primary/5 shadow-xl shadow-primary/5">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-serif font-bold">
                <Calendar className="h-5 w-5 text-primary" /> Ghi chú nội bộ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <p className="text-sm italic leading-relaxed text-muted-foreground">
                {(pet as any).internalNotes ||
                  "Chưa có ghi chú nào cho thú cưng này."}
              </p>
            </CardContent>
          </Card>

          {/* Bottom Tabs */}
          <div className="space-y-6">
            <div className="flex w-fit items-center gap-1 rounded-2xl border border-border bg-muted/30 p-1">
              <TabButton
                active={activeTab === "medical"}
                onClick={() => setActiveTab("medical")}
                icon={Stethoscope}
              >
                Hồ sơ y tế
              </TabButton>
              <TabButton
                active={activeTab === "media"}
                onClick={() => setActiveTab("media")}
                icon={ImageIcon}
              >
                Hình ảnh/Video
              </TabButton>
              <TabButton
                active={activeTab === "logs"}
                onClick={() => setActiveTab("logs")}
                icon={History}
              >
                Nhật ký hoạt động
              </TabButton>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "medical" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-none shadow-xl shadow-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between p-8">
                      <CardTitle className="text-lg font-bold">
                        Lịch sử khám & tiêm phòng
                      </CardTitle>
                      <Button
                        variant="outline"
                        className="h-10 rounded-xl border-primary/20 px-4 font-bold text-primary"
                        onClick={() =>
                          toast("Thêm hồ sơ y tế đang được phát triển")
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" /> Thêm hồ sơ
                      </Button>
                    </CardHeader>

                    <CardContent className="p-0 overflow-x-auto">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="border-y border-border bg-muted/30">
                            <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              Ngày
                            </th>
                            <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              Vaccine
                            </th>
                            <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              Chẩn đoán
                            </th>
                            <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              Mô tả
                            </th>
                            <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              Người tạo
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                          {Array.isArray((pet as any).medicalRecords) &&
                          (pet as any).medicalRecords.length > 0 ? (
                            (pet as any).medicalRecords.map((record: any) => (
                              <tr
                                key={record.recordId ?? `${record.recordDate}`}
                              >
                                <td className="px-8 py-5 text-sm font-medium">
                                  {formatDateVi(record.recordDate)}
                                </td>
                                <td className="px-8 py-5">
                                  <Badge
                                    variant="outline"
                                    className="border-primary/10 bg-primary/5 text-primary"
                                  >
                                    {record.vaccine ?? "—"}
                                  </Badge>
                                </td>
                                <td className="px-8 py-5 text-sm font-bold text-foreground">
                                  {record.diagnosis ?? "—"}
                                </td>
                                <td className="max-w-[200px] truncate px-8 py-5 text-xs text-muted-foreground">
                                  {record.description ?? "—"}
                                </td>
                                <td className="px-8 py-5 text-sm font-medium">
                                  {record.createdBy ?? "—"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={5}
                                className="px-8 py-6 text-sm text-muted-foreground"
                              >
                                Chưa có hồ sơ y tế.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === "media" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-none shadow-xl shadow-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between p-8">
                      <CardTitle className="text-lg font-bold">
                        Thư viện phương tiện
                      </CardTitle>
                      <Button
                        variant="default"
                        className="h-10 rounded-xl px-6 shadow-lg shadow-primary/20"
                        onClick={() =>
                          toast("Upload media đang được phát triển")
                        }
                      >
                        <Upload className="mr-2 h-4 w-4" /> Tải lên media
                      </Button>
                    </CardHeader>

                    <CardContent className="p-8 pt-0">
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {Array.isArray((pet as any).mediaGallery) &&
                        (pet as any).mediaGallery.length > 0 ? (
                          (pet as any).mediaGallery.map((media: any) => (
                            <div
                              key={media.mediaId ?? media.url}
                              className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted"
                            >
                              <Image
                                src={media.url}
                                alt={ "media"}
                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                              />
                              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg bg-white/20 text-white backdrop-blur-sm"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg bg-white/20 text-white backdrop-blur-sm"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full text-sm text-muted-foreground">
                            Chưa có media.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === "logs" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-none shadow-xl shadow-primary/5">
                    <CardHeader className="p-8">
                      <CardTitle className="text-lg font-bold">
                        Nhật ký hoạt động
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 text-sm text-muted-foreground">
                      {(pet as any).activityLogs?.length
                        ? "Hiển thị nhật ký tại đây"
                        : "Chưa có nhật ký."}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Organization Card */}
          <Card className="overflow-hidden border-none shadow-xl shadow-primary/5">
            <div className="h-2 bg-primary" />
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-bold">
                Trung tâm quản lý
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8 pt-0">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted text-primary">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">
                    {orgName}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {orgId}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="h-11 w-full rounded-xl border-primary/20 font-bold text-primary"
                onClick={() => {
                  if (orgId && orgId !== "—") router.push(`/quan-ly-trung-tam`);
                }}
              >
                Xem hồ sơ trung tâm <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="border-none shadow-xl shadow-primary/5">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-bold">
                Vị trí hiện tại
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8 pt-0">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-bold">{pet.province ?? "—"}</p>
                    <p className="text-xs font-medium text-muted-foreground">
                      {pet.ward ?? "—"}
                    </p>
                  </div>
                </div>

                <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
                  <Image
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400"
                    alt="fake"
                    width={400}
                    height={225}
                    className="h-full w-full object-cover opacity-50 grayscale"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="h-8 w-8 animate-bounce fill-primary/20 text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ownership Timeline */}
          <Card className="border-none shadow-xl shadow-primary/5">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-bold">
                Lịch sử sở hữu
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="relative space-y-6 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-px before:bg-border">
                {Array.isArray((pet as any).ownershipHistory) &&
                (pet as any).ownershipHistory.length > 0 ? (
                  (pet as any).ownershipHistory.map(
                    (owner: any, idx: number) => (
                      <div
                        key={`${idx}-${owner.ownerId ?? "x"}`}
                        className="relative pl-8"
                      >
                        <div
                          className={cn(
                            "absolute left-0 top-1.5 z-10 h-4 w-4 rounded-full border-2 border-white shadow-sm ring-4 ring-white",
                            idx === 0 ? "bg-primary" : "bg-muted-foreground",
                          )}
                        />
                        <div>
                          <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                            {owner.ownerName ?? "—"}
                            {idx === 0 && (
                              <Badge
                                variant="default"
                                className="h-3.5 px-1.5 text-[8px]"
                              >
                                Hiện tại
                              </Badge>
                            )}
                          </p>
                          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {owner.ownerType ?? "—"} • Từ{" "}
                            {formatDateVi(owner.fromTime)}{" "}
                            {owner.toTime
                              ? `đến ${formatDateVi(owner.toTime)}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    ),
                  )
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Chưa có lịch sử sở hữu.
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                className="mt-6 w-full text-xs font-bold text-primary hover:bg-primary/5"
                onClick={() =>
                  toast("Chuyển quyền sở hữu đang được phát triển")
                }
              >
                <ArrowRightLeft className="mr-2 h-3.5 w-3.5" /> Chuyển quyền sở
                hữu
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Label className="px-2 text-muted-foreground">Thao tác nhanh</Label>
            <div className="grid grid-cols-2 gap-3">
              <ActionButton icon={Edit2} label="Chỉnh sửa" />
              <ActionButton icon={ArrowRightLeft} label="Chuyển trung tâm" />
              <ActionButton
                icon={ShieldAlert}
                label="Báo vi phạm"
                color="text-amber-600 bg-amber-50"
              />
              <ActionButton
                icon={Trash2}
                label="Xóa hồ sơ"
                color="text-red-600 bg-red-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------- Subcomponents --------
function InfoItem({
  label,
  value,
  isBadge = false,
  badgeClassName,
}: {
  label: string;
  value: string;
  isBadge?: boolean;
  badgeClassName?: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      {isBadge ? (
        <Badge
          className={cn(
            "h-6 px-3 text-[11px] font-bold uppercase tracking-wider",
            badgeClassName,
          )}
        >
          {value}
        </Badge>
      ) : (
        <p className="text-sm font-bold text-foreground">{value}</p>
      )}
    </div>
  );
}

function TabButton({
  children,
  active,
  onClick,
  icon: Icon,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  icon: any;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-300",
        active
          ? "bg-white text-primary shadow-sm"
          : "text-muted-foreground hover:bg-white/50",
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

function ActionButton({
  icon: Icon,
  label,
  color = "bg-white text-foreground",
}: {
  icon: any;
  label: string;
  color?: string;
}) {
  return (
    <Button
      variant="outline"
      className={cn(
        "h-auto flex flex-col items-center justify-center gap-2 rounded-2xl border-border py-4 transition-all hover:border-primary/30",
        color,
      )}
      onClick={() => toast("Chức năng đang được phát triển")}
    >
      <Icon className="h-5 w-5" />
      <span className="text-[10px] font-bold uppercase tracking-widest">
        {label}
      </span>
    </Button>
  );
}

function PetDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-10 w-64 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Skeleton className="aspect-[21/9] w-full rounded-3xl" />
          <Skeleton className="h-[300px] w-full rounded-3xl" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-[200px] w-full rounded-3xl" />
          <Skeleton className="h-[200px] w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
