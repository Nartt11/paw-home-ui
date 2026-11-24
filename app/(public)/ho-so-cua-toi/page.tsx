"use client";

import { useSearchParams } from "next/navigation";
import { MyAdoptions } from "@/components/adoption/MyAdoptions";
import React, { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Plus,
  HeartHandshake,
  Loader2,
  XCircle,
  CheckCircle2,
  HelpCircle,
  Building,
  Mail,
  Phone,
  ArrowRight,
  MapPin,
} from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { ProfileForm } from "@/components/user/ProfileForm";
import { useCreateOrganization, useMyOrganization } from "@/hooks/use-organization";
import { OrganizationFormDialog } from "@/components/organization/OrganizationFormDialog";
import type { OrganizationCreatePayload } from "@/types/organization.type";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const PROFILE_TABS = ["profile", "adoptions", "centers"];

export default function MyProfilePage() {
  return (
    <React.Suspense fallback={null}>
      <MyProfileContent />
    </React.Suspense>
  );
}

function MyProfileContent() {
  const { data: currentUser, isPending: isUserPending } = useCurrentUser();
  // ?tab=adoptions opens a tab directly, e.g. from a notification about an adoption.
  const requestedTab = useSearchParams().get("tab");

  const [activeTab, setActiveTab] = useState(
    requestedTab && PROFILE_TABS.includes(requestedTab) ? requestedTab : "profile",
  );
  const sidebarItems = [
    { id: "profile", label: "Thông tin cá nhân", icon: User },
    { id: "adoptions", label: "Hồ sơ nhận nuôi", icon: HeartHandshake },
    { id: "centers", label: "Hồ sơ trung tâm", icon: Building },
  ];

  const renderTabContent = () => {
    if (activeTab === "adoptions") {
      return <MyAdoptions />;
    }
    if (activeTab === "centers") {
      return <CenterProfilesTab />;
    }

    if (activeTab !== "profile") {
      const activeItem = sidebarItems.find((item) => item.id === activeTab);
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">{activeItem?.label}</h3>
          </div>
          <Separator />
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            Tính năng cấu hình {activeItem?.label} đang được phát triển.
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Thông tin cá nhân</h3>
          <p className="text-sm text-muted-foreground">Tên hiển thị, ảnh và cách liên hệ với bạn.</p>
        </div>
        <Separator />
        <ProfileForm />
      </div>
    );
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-10">
      <div className="space-y-0.5 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Hồ sơ của tôi
        </h1>
        <p className="text-muted-foreground text-sm">
          Thông tin cá nhân, đơn nhận nuôi và trung tâm bạn quản lý.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:w-1/4">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-semibold rounded-md transition cursor-pointer select-none whitespace-nowrap ${
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Setting Content Area */}
        <div className="flex-1 max-w-3xl">
          {isUserPending && !currentUser ? (
            <div className="space-y-6">
              <div className="h-10 w-24 bg-muted animate-pulse rounded-md" />
              <Separator />
              <div className="h-48 w-full bg-muted animate-pulse rounded-md" />
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>
    </div>
  );
}

function CenterProfilesTab() {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const createMutation = useCreateOrganization();
  const myOrgQuery = useMyOrganization();
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const centers = React.useMemo(() => {
    if (!currentUser || myOrgQuery.isError) return [];

    if (myOrgQuery.data && myOrgQuery.data.organization) {
      const org = myOrgQuery.data.organization;
      return [
        {
          organizationId: org.organizationId,
          name: org.name,
          type: org.type,
          status: org.status as "ACTIVE" | "PENDING" | "INACTIVE",
          streetAddress: org.streetAddress,
          wardName: org.wardName || "",
          provinceName: org.provinceName || "",
          phone: org.phone,
          email: org.email,
          officialLink: org.officialLink || "",
          description: org.description || "",
          imageUrl: org.imageUrl || "",
        }
      ];
    }
    
    return [];
  }, [currentUser, myOrgQuery.data, myOrgQuery.isError]);

  const handleCreateCenter = (payload: OrganizationCreatePayload) => {
    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Gửi yêu cầu đăng ký trung tâm thành công!");
        setOpenCreate(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      ALL: centers.length,
      PENDING: 0,
      ACTIVE: 0,
      INACTIVE: 0,
    };
    centers.forEach((item) => {
      if (item.status in counts) {
        counts[item.status]++;
      }
    });
    return counts;
  }, [centers]);

  const filteredList = React.useMemo(() => {
    if (selectedStatus === "ALL") return centers;
    return centers.filter((item) => item.status === selectedStatus);
  }, [centers, selectedStatus]);

  if (myOrgQuery.isPending && currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">
          Đang tải thông tin trung tâm...
        </p>
      </div>
    );
  }

  const filterPills = [
    { value: "ALL", label: "Tất cả" },
    { value: "PENDING", label: "Chờ xét duyệt" },
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Tạm ngưng" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Hồ sơ trung tâm của tôi</h3>
          <p className="text-sm text-muted-foreground">
            Quản lý các trung tâm cứu hộ hoặc phòng khám thú y bạn làm chủ.
          </p>
        </div>
        <Button
          onClick={() => setOpenCreate(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Đăng ký trung tâm</span>
        </Button>
      </div>
      <Separator />

      <div className="flex flex-wrap gap-2 pb-2">
        {filterPills.map((pill) => {
          const isActive = selectedStatus === pill.value;
          const count = statusCounts[pill.value] || 0;
          return (
            <button
              key={pill.value}
              onClick={() => setSelectedStatus(pill.value)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition cursor-pointer select-none border ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-foreground bg-card"
              }`}
            >
              {pill.label} ({count})
            </button>
          );
        })}
      </div>

      {filteredList.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <Building className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-sm text-muted-foreground font-medium">
            Không có trung tâm nào ở trạng thái này.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((center) => (
            <div
              key={center.organizationId}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row gap-5 justify-between">
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-muted border border-border shrink-0">
                    <Image
                      src={center.imageUrl}
                      alt={center.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-lg leading-tight">
                        {center.name}
                      </h4>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">
                        {center.type === "SHELTER" ? "Mái ấm cứu hộ" : "Phòng khám thú y"}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {center.description}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {center.streetAddress}, {center.provinceName}
                      </span>
                      {center.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {center.phone}
                        </span>
                      )}
                      {center.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {center.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 border-border/60 pt-3 md:pt-0 shrink-0">
                  <CenterStatusBadge status={center.status} />

                  {center.status === "ACTIVE" && (
                    <Button
                      onClick={() => router.push("/dashboard")}
                      className="bg-black hover:bg-black/95 text-white rounded-xl text-xs font-semibold px-4 h-9 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Quản lý trung tâm</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <OrganizationFormDialog
        mode="create"
        open={openCreate}
        onOpenChange={setOpenCreate}
        submitting={createMutation.isPending}
        onSubmit={handleCreateCenter}
      />
    </div>
  );
}

function CenterStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
          <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
          Chờ xét duyệt
        </span>
      );
    case "ACTIVE":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          Hoạt động
        </span>
      );
    case "INACTIVE":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
          <XCircle className="h-3.5 w-3.5 text-slate-400" />
          Tạm ngưng
        </span>
      );
  }
}

