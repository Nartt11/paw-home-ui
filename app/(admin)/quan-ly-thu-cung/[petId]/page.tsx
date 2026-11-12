"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowLeft,
  Building2,
  Calendar,
  ChevronRight,
  Eye,
  History,
  Image as ImageIcon,
  Loader2,
  MapPin,
  RefreshCw,
  Star,
  Trash2,
} from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";
import RequireAuth from "@/components/auth/RequireAuth";
import { SYSTEM_ROLES, ORGANIZATION_ROLES } from "@/constants/roles";

import {
  useDeletePet,
  useDeletePetMedia,
  usePetDetail,
  usePetMedia,
  usePetMedicalRecords,
  usePetOwnerships,
  useUpdatePet,
  useUpdatePetMediaPrimary,
} from "@/hooks/use-pet";
import type {
  Pet,
  PetHealthStatus,
  PetMedia,
  PetMedicalRecord,
  PetOwnership,
  PetStatus,
  PetUpdatePayload,
} from "@/types/pet.type";
import { PetUpdateDialog } from "@/components/pet/PetUpdateDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import {
  PET_DETAIL_IMAGE_FALLBACK,
  PET_DETAIL_MEDIA_QUERY,
  PET_DETAIL_SECTION_QUERY,
  PET_DETAIL_TABS,
  PET_GENDER_LABELS,
  PET_HEALTH_BADGE_CLASSNAMES,
  PET_HEALTH_LABELS,
  PET_STATUS_BADGE_CLASSNAMES,
  PET_STATUS_LABELS,
} from "./constants";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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

function formatDateTimeVi(value?: string) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getGenderLabel(gender?: Pet["gender"]) {
  if (!gender) return "—";
  return PET_GENDER_LABELS[gender] ?? gender;
}

function getPetStatusLabel(status?: PetStatus) {
  if (!status) return "—";
  return PET_STATUS_LABELS[status] ?? status;
}

function getPetStatusBadgeClassName(status?: PetStatus) {
  if (!status) return "bg-muted text-muted-foreground hover:bg-muted";
  return PET_STATUS_BADGE_CLASSNAMES[status];
}

function getHealthStatusLabel(status?: PetHealthStatus) {
  if (!status) return "—";
  return PET_HEALTH_LABELS[status] ?? status;
}

function getHealthStatusBadgeClassName(status?: PetHealthStatus) {
  if (!status) return "bg-muted text-muted-foreground hover:bg-muted";
  return PET_HEALTH_BADGE_CLASSNAMES[status];
}

function getCoverUrl(pet?: Pet, media?: PetMedia[]) {
  const primaryMedia = media?.find((item) => item.primaryMedia)?.url;
  return primaryMedia || pet?.imageUrls[0] || PET_DETAIL_IMAGE_FALLBACK;
}

export default function PetDetailPage() {
  const params = useParams<{ petId: string }>();
  const petId = params?.petId;
  const router = useRouter();

  const { data: currentUser } = useCurrentUser();
  const isOrganizationUser = currentUser?.roles.includes(SYSTEM_ROLES.MEMBER) && !!currentUser?.organizationRole;

  const petQuery = usePetDetail(petId);
  const medicalRecordsQuery = usePetMedicalRecords(petId, {
    petId,
    ...PET_DETAIL_SECTION_QUERY,
  });
  const mediaQuery = usePetMedia(petId, {
    petId,
    ...PET_DETAIL_MEDIA_QUERY,
  });
  const ownershipsQuery = usePetOwnerships(petId, {
    petId,
    ...PET_DETAIL_SECTION_QUERY,
  });

  const deletePetMutation = useDeletePet();
  const deleteMediaMutation = useDeletePetMedia();
  const updatePetMutation = useUpdatePet();
  const updatePrimaryMediaMutation = useUpdatePetMediaPrimary();

  const pet = petQuery.data ?? null;

  const canModify = React.useMemo(() => {
    if (!isOrganizationUser) return true;
    return currentUser?.organizationRole === ORGANIZATION_ROLES.OWNER || currentUser?.organizationRole === ORGANIZATION_ROLES.STAFF;
  }, [isOrganizationUser, currentUser?.organizationRole]);

  const isMyOrganizationPet = React.useMemo(() => {
    if (!isOrganizationUser) return true;
    const petOrgId = pet?.organization?.organizationId || pet?.shelterId;
    return petOrgId === currentUser?.organizationId;
  }, [isOrganizationUser, pet?.organization?.organizationId, pet?.shelterId, currentUser?.organizationId]);

  const medicalRecords = medicalRecordsQuery.data?.content ?? [];
  const mediaItems = mediaQuery.data?.content ?? [];
  const ownerships = ownershipsQuery.data?.content ?? [];
  const [activeTab, setActiveTab] = React.useState<
    "medical" | "media" | "logs"
  >("medical");
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);

  const coverUrl = getCoverUrl(pet ?? undefined, mediaItems);
  const images = pet?.imageUrls?.length ? pet.imageUrls : [coverUrl];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const organizationName = pet?.organization?.name || "Cộng đồng";
  const ownerName = pet?.owner?.name || "Đang cập nhật";
  const locationText = pet?.rescueLocation || pet?.province || "Đang cập nhật";

  const handleOpenUpdateDialog = React.useCallback(() => {
    setUpdateDialogOpen(true);
  }, []);

  const handleUpdatePet = React.useCallback(
    async (payload: Partial<PetUpdatePayload>) => {
      if (!petId) return;

      try {
        await updatePetMutation.mutateAsync({
          petId,
          payload,
        });
        setUpdateDialogOpen(false);
        toast.success("Cập nhật thú cưng thành công.");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Cập nhật thú cưng thất bại.",
        );
      }
    },
    [petId, updatePetMutation],
  );

  const handleRefreshDetail = React.useCallback(() => {
    void Promise.all([
      petQuery.refetch(),
      medicalRecordsQuery.refetch(),
      mediaQuery.refetch(),
      ownershipsQuery.refetch(),
    ]);
    toast.success("Đang làm mới dữ liệu.");
  }, [mediaQuery, medicalRecordsQuery, ownershipsQuery, petQuery]);

  const handleDeletePet = React.useCallback(async () => {
    if (!petId) return;

    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa hồ sơ thú cưng này không?",
    );

    if (!confirmed) return;

    try {
      await deletePetMutation.mutateAsync(petId);
      toast.success("Đã xóa hồ sơ thú cưng.");
      router.push("/quan-ly-thu-cung");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Xóa hồ sơ thất bại.",
      );
    }
  }, [deletePetMutation, petId, router]);

  const handleDeleteMedia = React.useCallback(
    async (mediaId: string) => {
      if (!petId) return;

      const confirmed = window.confirm("Bạn có chắc muốn xóa media này không?");
      if (!confirmed) return;

      try {
        await deleteMediaMutation.mutateAsync({ petId, mediaId });
        toast.success("Đã xóa media.");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Xóa media thất bại.",
        );
      }
    },
    [deleteMediaMutation, petId],
  );

  const handleSetPrimaryMedia = React.useCallback(
    async (mediaId: string) => {
      if (!petId) return;

      try {
        await updatePrimaryMediaMutation.mutateAsync({ petId, mediaId });
        toast.success("Đã cập nhật ảnh chính.");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Cập nhật ảnh chính thất bại.",
        );
      }
    },
    [petId, updatePrimaryMediaMutation],
  );

  if (petQuery.isPending) {
    return <PetDetailSkeleton />;
  }

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

  if (!pet) {
    return (
      <EmptyStateCard
        title="Không tìm thấy hồ sơ thú cưng"
        description="Hồ sơ có thể đã bị xóa hoặc chưa sẵn sàng để hiển thị."
        action={
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => router.push("/quan-ly-thu-cung")}
          >
            Quay lại danh sách
          </Button>
        }
      />
    );
  }

  return (
    <RequireAuth
      allowedSystemRoles={[SYSTEM_ROLES.ADMIN]}
      allowedOrganizationRoles={[
        ORGANIZATION_ROLES.OWNER,
        ORGANIZATION_ROLES.STAFF,
        ORGANIZATION_ROLES.MEMBER,
      ]}
    >
      {!isMyOrganizationPet ? (
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
          Bạn không có quyền truy cập hồ sơ thú cưng của tổ chức khác.
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-700">
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
                {pet.name || "—"}
              </h1>
              {pet.petCode ? (
                <Badge
                  variant="outline"
                  className="h-6 px-3 text-[10px] font-bold uppercase tracking-widest"
                >
                  {pet.petCode}
                </Badge>
              ) : null}
            </div>

            <p className="mt-1 flex items-center gap-2 font-medium text-muted-foreground">
              {pet.species || "—"} • {pet.breed || "—"} •{" "}
              {pet.ageDisplay || "—"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {canModify && (
            <Button
              variant="outline"
              className="h-11 rounded-xl border-border px-6 font-bold text-muted-foreground"
              onClick={handleOpenUpdateDialog}
            >
              Cập nhật
            </Button>
          )}

          <Button
            variant="outline"
            className="h-11 rounded-xl px-6 font-bold"
            onClick={handleRefreshDetail}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Card className="">
            <CardContent className="grid gap-0 p-0 lg:grid-cols-[420px_minmax(0,1fr)]">
              {/* LEFT: IMAGE GALLERY */}
              <div className="space-y-3 bg-muted/40 p-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="relative h-[360px] w-full overflow-hidden rounded-2xl bg-muted">
                      <Image
                        src={selectedImage}
                        alt={pet.name || "Pet image"}
                        fill
                        unoptimized
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </button>
                  </DialogTrigger>

                  <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
                    <div className="relative h-[80vh] w-full overflow-hidden rounded-2xl bg-background">
                      <Image
                        src={selectedImage}
                        alt={pet.name || "Pet image"}
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button
                      key={image}
                      onClick={() => setSelectedImage(image)}
                      className={cn(
                        "relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 bg-muted",
                        selectedImage === image
                          ? "border-primary"
                          : "border-transparent hover:border-primary/40",
                      )}
                    >
                      <Image
                        src={image}
                        alt={`${pet.name || "Pet"} image ${index + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT: PET INFO */}
              <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={cn(
                          "rounded-full px-4 py-1.5 font-bold",
                          getPetStatusBadgeClassName(pet.status),
                        )}
                      >
                        {getPetStatusLabel(pet.status)}
                      </Badge>

                      <Badge
                        className={cn(
                          "rounded-full px-4 py-1.5 font-bold",
                          getHealthStatusBadgeClassName(pet.healthStatus),
                        )}
                      >
                        {getHealthStatusLabel(pet.healthStatus)}
                      </Badge>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                      {pet.name || "Chưa có tên"}
                    </h1>

                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span>
                        Mã thú cưng:{" "}
                        <strong className="text-foreground">
                          {pet.petCode}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Chủ sở hữu:{" "}
                        <strong className="text-foreground">
                          {ownerName || "Chưa cập nhật"}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-muted-foreground">
                    {pet.description ||
                      "Chưa có mô tả chi tiết cho thú cưng này trong hệ thống."}
                  </p>

                  <div className="flex flex-wrap text-sm">
                    <SummaryStat
                      label="Tuổi"
                      value={pet.ageDisplay || `${pet.age} tháng`}
                    />
                    <SummaryStat
                      label="Giới tính"
                      value={getGenderLabel(pet.gender)}
                    />
                    <SummaryStat label="Trung tâm" value={organizationName} />
                    <SummaryStat label="Vị trí" value={locationText} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {pet.vaccinated && (
                      <Badge className="rounded-full bg-emerald-50 px-4 py-1.5 font-bold text-emerald-700 hover:bg-emerald-50">
                        Đã tiêm vaccine
                      </Badge>
                    )}

                    {pet.neutered && (
                      <Badge className="rounded-full bg-sky-50 px-4 py-1.5 font-bold text-sky-700 hover:bg-sky-50">
                        Đã triệt sản
                      </Badge>
                    )}

                    <Badge
                      variant="outline"
                      className="rounded-full px-4 py-1.5 font-bold"
                    >
                      {pet.color || "Đang cập nhật màu sắc"}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 border-t pt-5">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setActiveTab("media")}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Xem thư viện ảnh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-serif font-bold">
                <Activity className="h-5 w-5 text-primary" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-x-12 gap-y-8 md:grid-cols-3">
                <InfoItem label="Tên gọi" value={pet.name || "—"} />
                <InfoItem
                  label="Mã hồ sơ"
                  value={pet.petCode || "Đang cập nhật"}
                />
                <InfoItem label="Loài" value={pet.species || "—"} />

                <InfoItem label="Giống" value={pet.breed || "—"} />
                <InfoItem label="Tuổi" value={pet.ageDisplay || "—"} />
                <InfoItem
                  label="Giới tính"
                  value={getGenderLabel(pet.gender)}
                />

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
                  value={getPetStatusLabel(pet.status)}
                  isBadge
                  badgeClassName={getPetStatusBadgeClassName(pet.status)}
                />
                <InfoItem
                  label="Sức khỏe"
                  value={getHealthStatusLabel(pet.healthStatus)}
                  isBadge
                  badgeClassName={getHealthStatusBadgeClassName(
                    pet.healthStatus,
                  )}
                />

                <InfoItem label="Chủ hiện tại" value={ownerName} />
                <InfoItem label="Trung tâm quản lý" value={organizationName} />
                <InfoItem
                  label="Ngày tiếp nhận"
                  value={formatDateVi(pet.rescueDate)}
                />
                <InfoItem
                  label="Ngày tạo"
                  value={formatDateTimeVi(pet.createdAt)}
                />
                <InfoItem
                  label="Cập nhật"
                  value={formatDateTimeVi(pet.updatedAt)}
                />
                <InfoItem
                  label="Cân nặng"
                  value={pet.weight ? `${pet.weight} kg` : "Đang cập nhật"}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-primary bg-primary/5 shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-serif font-bold">
                <Calendar className="h-5 w-5 text-primary" />
                Mô tả thêm
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <p className="text-sm italic leading-relaxed text-muted-foreground">
                {pet.description || "Chưa có ghi chú bổ sung cho thú cưng này."}
              </p>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <div className="flex w-fit items-center gap-1 rounded-2xl border border-border bg-muted/30 p-1">
              {PET_DETAIL_TABS.map((tab) => (
                <TabButton
                  key={tab.value}
                  active={activeTab === tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  icon={tab.icon}
                >
                  {tab.label}
                </TabButton>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "medical" ? (
                <motion.div
                  key="medical"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-none shadow-xl shadow-primary/5">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold">
                        Lịch sử khám và tiêm phòng
                      </CardTitle>
                      <Button
                        variant="outline"
                        className="h-10 rounded-xl border-primary/20 px-4 font-bold text-primary"
                        onClick={() => void medicalRecordsQuery.refetch()}
                        disabled={medicalRecordsQuery.isRefetching}
                      >
                        {medicalRecordsQuery.isRefetching ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Làm mới
                      </Button>
                    </CardHeader>

                    <CardContent className="overflow-x-auto p-0">
                      {medicalRecordsQuery.isPending ? (
                        <SectionTableSkeleton />
                      ) : medicalRecordsQuery.isError ? (
                        <InlineState
                          title="Không tải được hồ sơ y tế"
                          description="Thử làm mới lại danh sách hồ sơ y tế."
                        />
                      ) : medicalRecords.length ? (
                        <MedicalRecordsTable records={medicalRecords} />
                      ) : (
                        <InlineState
                          title="Chưa có hồ sơ y tế"
                          description="Khi backend trả dữ liệu hồ sơ y tế, danh sách sẽ hiển thị tại đây."
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : null}

              {activeTab === "media" ? (
                <motion.div
                  key="media"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-none shadow-xl shadow-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between p-8">
                      <CardTitle className="text-lg font-bold">
                        Thư viện media
                      </CardTitle>
                      <Button
                        variant="outline"
                        className="h-10 rounded-xl px-6"
                        onClick={() => void mediaQuery.refetch()}
                        disabled={mediaQuery.isRefetching}
                      >
                        {mediaQuery.isRefetching ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Làm mới
                      </Button>
                    </CardHeader>

                    <CardContent className="p-8 pt-0">
                      {mediaQuery.isPending ? (
                        <MediaGridSkeleton />
                      ) : mediaQuery.isError ? (
                        <InlineState
                          title="Không tải được media"
                          description="Thử làm mới để lấy lại thư viện ảnh."
                        />
                      ) : mediaItems.length ? (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                          {mediaItems.map((media) => (
                            <MediaCard
                              key={media.mediaId}
                              media={media}
                              busy={
                                deleteMediaMutation.isPending ||
                                updatePrimaryMediaMutation.isPending
                              }
                              onDelete={() =>
                                void handleDeleteMedia(media.mediaId)
                              }
                              onPreview={() => window.open(media.url, "_blank")}
                              onSetPrimary={() =>
                                void handleSetPrimaryMedia(media.mediaId)
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <InlineState
                          title="Chưa có media"
                          description="Hiện chưa có hình ảnh hoặc video nào được gắn với hồ sơ này."
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : null}

              {activeTab === "logs" ? (
                <motion.div
                  key="logs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-none shadow-xl shadow-primary/5">
                    <CardHeader className="p-8">
                      <CardTitle className="text-lg font-bold">
                        Hoạt động gần đây
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                      <InlineState
                        title="Chưa có endpoint nhật ký hoạt động"
                        description="Tab này đã sẵn sàng về giao diện và sẽ hiển thị khi backend cung cấp nguồn dữ liệu tương ứng."
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <Label className="px-2 text-muted-foreground">Thao tác nhanh</Label>
            <div className="grid grid-cols-2 gap-3">
              <ActionButton
                icon={ImageIcon}
                label="Mở thư viện"
                onClick={() => setActiveTab("media")}
              />
              {canModify && (
                <ActionButton
                  icon={RefreshCw}
                  label="Cập nhật"
                  onClick={handleOpenUpdateDialog}
                />
              )}
              <ActionButton
                icon={RefreshCw}
                label="Làm mới"
                onClick={handleRefreshDetail}
              />
              {canModify && (
                <ActionButton
                  icon={Trash2}
                  label="Xóa hồ sơ"
                  color="text-red-600 bg-red-50"
                  onClick={() => void handleDeletePet()}
                  disabled={deletePetMutation.isPending}
                />
              )}
            </div>
          </div>

          <Card className="overflow-hidden border-none shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Trung tâm quản lý
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 ">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted text-primary">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">
                    {organizationName}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    {pet.owner?.caretakerName || "Đang quản lý hồ sơ thú cưng"}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="h-11 w-full rounded-xl border-primary/20 font-bold text-primary"
                onClick={() => router.push("/quan-ly-trung-tam")}
              >
                Xem hồ sơ trung tâm
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Vị trí hiện tại
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 ">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-bold">{pet.province || "—"}</p>
                    <p className="text-xs font-medium text-muted-foreground">
                      {pet.ward || "—"}
                    </p>
                  </div>
                </div>

                <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
                  <Image
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400"
                    alt="Bản đồ minh họa"
                    width={400}
                    height={225}
                    className="h-full w-full object-cover opacity-50 grayscale"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="h-8 w-8 animate-bounce fill-primary/20 text-primary" />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {pet.rescueLocation ||
                    "Chưa có mô tả chi tiết về địa điểm tiếp nhận."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Lịch sử sở hữu
              </CardTitle>
            </CardHeader>
            <CardContent className="">
              {ownershipsQuery.isPending ? (
                <TimelineSkeleton />
              ) : ownershipsQuery.isError ? (
                <InlineState
                  title="Không tải được lịch sử sở hữu"
                  description="Thử làm mới lại thông tin sở hữu."
                />
              ) : ownerships.length ? (
                <OwnershipTimeline ownerships={ownerships} />
              ) : (
                <InlineState
                  title="Chưa có lịch sử sở hữu"
                  description="Thông tin chuyển giao sở hữu sẽ xuất hiện tại đây khi backend trả dữ liệu."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <PetUpdateDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        pet={pet}
        mediaItems={mediaItems}
        submitting={updatePetMutation.isPending}
        onSubmit={(values) => void handleUpdatePet(values)}
      />
    </div>
      )}
    </RequireAuth>
  );
}

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

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl p-4 w-full">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold text-foreground">{value}</p>
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
  icon: LucideIcon;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
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
    </Button>
  );
}

function ActionButton({
  icon: Icon,
  label,
  color = "bg-white text-foreground",
  onClick,
  disabled = false,
}: {
  icon: LucideIcon;
  label: string;
  color?: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="outline"
      className={cn(
        "h-auto flex-col gap-2 rounded-2xl border-border py-4 transition-all hover:border-primary/30",
        color,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="h-5 w-5" />
      <span className="text-[10px] font-bold uppercase tracking-widest">
        {label}
      </span>
    </Button>
  );
}

function EmptyStateCard({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-16 text-center">
        <div className="rounded-full bg-muted p-4">
          <History className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">{title}</p>
          <p className="max-w-md text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}

function InlineState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function MedicalRecordsTable({ records }: { records: PetMedicalRecord[] }) {
  return (
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
        {records.map((record) => (
          <tr key={record.recordId}>
            <td className="px-8 py-5 text-sm font-medium">
              {formatDateVi(record.recordDate)}
            </td>
            <td className="px-8 py-5">
              <Badge
                variant="outline"
                className="border-primary/10 bg-primary/5 text-primary"
              >
                {record.vaccine || "Đang cập nhật"}
              </Badge>
            </td>
            <td className="px-8 py-5 text-sm font-bold text-foreground">
              {record.diagnosis || "Đang cập nhật"}
            </td>
            <td className="max-w-[220px] truncate px-8 py-5 text-xs text-muted-foreground">
              {record.description || "Không có mô tả"}
            </td>
            <td className="px-8 py-5 text-sm font-medium">
              {record.createdBy || "Hệ thống"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MediaCard({
  media,
  busy,
  onDelete,
  onPreview,
  onSetPrimary,
}: {
  media: PetMedia;
  busy: boolean;
  onDelete: () => void;
  onPreview: () => void;
  onSetPrimary: () => void;
}) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
      <Image
        src={media.url}
        alt="Pet media"
        fill
        unoptimized
        className="object-cover transition-transform group-hover:scale-110"
      />
      <div className="absolute left-3 top-3">
        {media.primaryMedia ? (
          <Badge className="rounded-full bg-white/90 text-primary hover:bg-white/90">
            Ảnh chính
          </Badge>
        ) : null}
      </div>
      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg bg-white/20 text-white backdrop-blur-sm"
          onClick={onPreview}
        >
          <Eye className="h-4 w-4" />
        </Button>
        {!media.primaryMedia ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg bg-white/20 text-white backdrop-blur-sm"
            onClick={onSetPrimary}
            disabled={busy}
          >
            <Star className="h-4 w-4" />
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg bg-white/20 text-white backdrop-blur-sm"
          onClick={onDelete}
          disabled={busy}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function OwnershipTimeline({ ownerships }: { ownerships: PetOwnership[] }) {
  return (
    <div className="relative space-y-6 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-px before:bg-border">
      {ownerships.map((owner, index) => (
        <div
          key={`${owner.ownerName}-${owner.fromTime}-${index}`}
          className="relative pl-8"
        >
          <div
            className={cn(
              "absolute left-0 top-1.5 z-10 h-4 w-4 rounded-full border-2 border-white shadow-sm ring-4 ring-white",
              index === 0 ? "bg-primary" : "bg-muted-foreground",
            )}
          />
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-foreground">
              {owner.ownerName || "Đang cập nhật"}
              {index === 0 ? (
                <Badge variant="default" className="h-5 px-2 text-[10px]">
                  Hiện tại
                </Badge>
              ) : null}
            </p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {owner.ownerType} • Từ {formatDateVi(owner.fromTime)}
              {owner.toTime ? ` đến ${formatDateVi(owner.toTime)}` : ""}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionTableSkeleton() {
  return (
    <div className="space-y-3 p-8">
      <Skeleton className="h-14 w-full rounded-2xl" />
      <Skeleton className="h-14 w-full rounded-2xl" />
      <Skeleton className="h-14 w-full rounded-2xl" />
    </div>
  );
}

function MediaGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="aspect-square rounded-2xl" />
      ))}
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-start gap-4">
          <Skeleton className="mt-1 h-4 w-4 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-3 w-52 rounded" />
          </div>
        </div>
      ))}
    </div>
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
          <Skeleton className="h-[320px] w-full rounded-3xl" />
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
