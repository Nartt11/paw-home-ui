"use client";
import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  MapPin,
  ShieldAlert,
  Calendar,
  Plus,
  Eye,
  Building2,
  ArrowRightLeft,
  Upload,
  ChevronRight,
  Activity,
  Stethoscope,
  Image as ImageIcon,
  History,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

export interface MedicalRecord {
  recordId: string;
  petId: string;
  description: string;
  vaccine: string;
  diagnosis: string;
  recordDate: string;
  createdBy: string;
}

export interface Ownership {
  petId: string;
  ownerType: "USER" | "ORGANIZATION";
  ownerId: string;
  ownerName: string;
  fromTime: string;
  toTime?: string;
}

export interface Media {
  mediaId: string;
  uploaderId: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  createdAt: string;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number; // months
  ageDisplay: string;
  vaccinated: boolean;
  gender: "MALE" | "FEMALE";
  status:
    | "UNOWNED"
    | "OWNED"
    | "ADOPTING"
    | "RESCUING"
    | "ARCHIVED"
    | "AVAILABLE";
  healthStatus: "HEALTHY" | "TREATING" | "CRITICAL" | "RECOVERING";
  organization: {
    id: string;
    name: string;
  };
  province: string;
  provinceCode: string;
  ward: string;
  wardCode: string;
  imageUrl: string;
  lastUpdate: string;
  internalNotes?: string;
  medicalRecords?: MedicalRecord[];
  ownershipHistory?: Ownership[];
  mediaGallery?: Media[];
}
const data: Pet = {
  id: "PET-001",
  name: "Luna",
  species: "Cat",
  breed: "British Shorthair",
  age: 24,
  ageDisplay: "2 years",
  vaccinated: true,
  gender: "FEMALE",
  status: "AVAILABLE",
  healthStatus: "HEALTHY",
  organization: { id: "C001", name: "HCM Rescue Center" },
  province: "TP. Hồ Chí Minh",
  provinceCode: "79",
  ward: "Phường Tân Phong",
  wardCode: "27501",
  imageUrl:
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400",
  lastUpdate: "2024-04-15",
  internalNotes: "Luna is very friendly and loves playing with laser pointers.",
  medicalRecords: [
    {
      recordId: "MR-001",
      petId: "PET-001",
      description: "Annual checkup",
      vaccine: "Rabies",
      diagnosis: "Healthy",
      recordDate: "2024-01-10",
      createdBy: "Dr. Minh",
    },
  ],
  ownershipHistory: [
    {
      petId: "PET-001",
      ownerType: "ORGANIZATION",
      ownerId: "C001",
      ownerName: "HCM Rescue Center",
      fromTime: "2023-05-20",
    },
  ],
  mediaGallery: [
    {
      mediaId: "M-001",
      uploaderId: "A001",
      url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
      type: "IMAGE",
      createdAt: "2023-05-20",
    },
  ],
};

export default function PetDetailPage() {
  const { petid } = useParams();
  const router = useRouter();
  const [pet, setPet] = React.useState<Pet | null>(data);
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<
    "medical" | "media" | "logs"
  >("medical");

  if (loading) return <PetDetailSkeleton />;
  if (!pet) return <div>Pet not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-serif font-bold text-foreground">
                {pet.name}
              </h1>
              <Badge
                variant="outline"
                className="text-[10px] font-bold uppercase tracking-widest px-3 h-6"
              >
                {pet.id}
              </Badge>
            </div>
            <p className="text-muted-foreground font-medium flex items-center gap-2 mt-1">
              {pet.species} • {pet.breed} • {pet.ageDisplay}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-border text-muted-foreground font-bold h-11 px-6 rounded-xl"
          >
            Chia sẻ hồ sơ
          </Button>
          <Button className="shadow-lg shadow-primary/20 font-bold h-11 px-8 rounded-xl">
            <Edit2 className="w-4 h-4 mr-2" /> Chỉnh sửa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Card */}
          <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden group">
            <CardContent className="p-0 relative aspect-[21/9]">
              <img
                src={pet.imageUrl}
                alt={pet.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div className="flex gap-2">
                  <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 px-4 py-1.5 rounded-full font-bold">
                    {pet.status}
                  </Badge>
                  <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 px-4 py-1.5 rounded-full font-bold">
                    {pet.healthStatus}
                  </Badge>
                </div>
                <Button className="bg-white hover:bg-white/90 text-primary font-bold rounded-xl shadow-xl">
                  <Upload className="w-4 h-4 mr-2" /> Đổi ảnh bìa
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info Card */}
          <Card className="border-none shadow-xl shadow-primary/5">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-serif font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-12">
                <InfoItem label="Tên gọi" value={pet.name} />
                <InfoItem label="Pet ID" value={pet.id} />
                <InfoItem label="Loài" value={pet.species} />
                <InfoItem label="Giống" value={pet.breed} />
                <InfoItem label="Tuổi" value={pet.ageDisplay} />
                <InfoItem label="Giới tính" value={pet.gender} />
                <InfoItem
                  label="Tiêm phòng"
                  value={pet.vaccinated ? "Đã tiêm" : "Chưa tiêm"}
                  isBadge={true}
                  badgeVariant={pet.vaccinated ? "success" : "warning"}
                />
                <InfoItem
                  label="Trạng thái"
                  value={pet.status}
                  isBadge={true}
                  badgeVariant="primary"
                />
                <InfoItem
                  label="Sức khỏe"
                  value={pet.healthStatus}
                  isBadge={true}
                  badgeVariant={
                    pet.healthStatus === "HEALTHY" ? "success" : "error"
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Internal Notes Card */}
          <Card className="border-none shadow-xl shadow-primary/5 bg-primary/5 border-l-4 border-primary">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-serif font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Ghi chú nội bộ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                {pet.internalNotes || "Chưa có ghi chú nào cho thú cưng này."}
              </p>
            </CardContent>
          </Card>

          {/* Bottom Tabs */}
          <div className="space-y-6">
            <div className="flex items-center gap-1 p-1 bg-muted/30 border border-border rounded-2xl w-fit">
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
                    <CardHeader className="p-8 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg font-bold">
                        Lịch sử khám & tiêm phòng
                      </CardTitle>
                      <Button
                        variant="outline"
                        className="border-primary/20 text-primary font-bold h-10 px-4 rounded-xl"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Thêm hồ sơ
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-muted/30 border-y border-border">
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
                          {pet.medicalRecords?.map((record) => (
                            <tr key={record.recordId}>
                              <td className="px-8 py-5 text-sm font-medium">
                                {record.recordDate}
                              </td>
                              <td className="px-8 py-5">
                                <Badge
                                  variant="outline"
                                  className="bg-primary/5 text-primary border-primary/10"
                                >
                                  {record.vaccine}
                                </Badge>
                              </td>
                              <td className="px-8 py-5 text-sm font-bold text-foreground">
                                {record.diagnosis}
                              </td>
                              <td className="px-8 py-5 text-xs text-muted-foreground max-w-[200px] truncate">
                                {record.description}
                              </td>
                              <td className="px-8 py-5 text-sm font-medium">
                                {record.createdBy}
                              </td>
                            </tr>
                          ))}
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
                    <CardHeader className="p-8 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg font-bold">
                        Thư viện phương tiện
                      </CardTitle>
                      <Button
                        variant="default"
                        className="h-10 px-6 rounded-xl shadow-lg shadow-primary/20"
                      >
                        <Upload className="w-4 h-4 mr-2" /> Tải lên media
                      </Button>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {pet.mediaGallery?.map((media) => (
                          <div
                            key={media.mediaId}
                            className="aspect-square rounded-2xl bg-muted overflow-hidden border border-border group relative"
                          >
                            <img
                              src={media.url}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg bg-white/20 text-white backdrop-blur-sm"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg bg-white/20 text-white backdrop-blur-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
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
          <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden">
            <div className="h-2 bg-primary" />
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-bold">
                Trung tâm quản lý
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-primary">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">
                    {pet.organization.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                    {pet.organization.id}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-primary/20 text-primary font-bold h-11 rounded-xl"
              >
                Xem hồ sơ trung tâm <ChevronRight className="w-4 h-4 ml-1" />
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
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-bold">{pet.province}</p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {pet.ward}
                    </p>
                  </div>
                </div>
                <div className="aspect-video rounded-2xl bg-muted overflow-hidden border border-border relative">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400"
                    className="w-full h-full object-cover opacity-50 grayscale"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-primary fill-primary/20 animate-bounce" />
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
              <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
                {pet.ownershipHistory?.map((owner, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div
                      className={cn(
                        "absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ring-4 ring-white z-10",
                        idx === 0 ? "bg-primary" : "bg-muted-foreground",
                      )}
                    />
                    <div>
                      <p className="text-sm font-bold text-foreground flex items-center gap-2">
                        {owner.ownerName}
                        {idx === 0 && (
                          <Badge
                            variant="default"
                            className="text-[8px] h-3.5 px-1.5"
                          >
                            Hiện tại
                          </Badge>
                        )}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                        {owner.ownerType} • Từ {owner.fromTime}{" "}
                        {owner.toTime ? `đến ${owner.toTime}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-6 text-primary text-xs font-bold hover:bg-primary/5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 mr-2" /> Chuyển quyền sở
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

// Subcomponents
function InfoItem({
  label,
  value,
  isBadge = false,
  badgeVariant = "default",
}: {
  label: string;
  value: string;
  isBadge?: boolean;
  badgeVariant?: any;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        {label}
      </p>
      {isBadge ? (
        <Badge
          variant={badgeVariant}
          className="px-3 h-6 text-[11px] font-bold uppercase tracking-wider"
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
        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300",
        active
          ? "bg-white text-primary shadow-sm"
          : "text-muted-foreground hover:bg-white/50",
      )}
    >
      <Icon className="w-4 h-4" />
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
        "h-auto py-4 flex flex-col items-center justify-center gap-2 rounded-2xl border-border hover:border-primary/30 transition-all",
        color,
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-bold uppercase tracking-widest">
        {label}
      </span>
    </Button>
  );
}

function PetDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-10 w-64 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
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
