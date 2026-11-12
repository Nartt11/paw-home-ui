"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  CreditCard,
  Palette,
  Bell,
  Sliders,
  Plus,
  Trash2,
  HeartHandshake,
  Calendar,
  FileText,
  Loader2,
  XCircle,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Building,
  ExternalLink,
  Mail,
  Phone,
  ArrowRight,
  MapPin,
} from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useUpdateMyProfile } from "@/hooks/use-user";
import { useAdoptionsByUser, useCancelAdoption } from "@/hooks/use-adoption";
import { useCreateOrganization, useOrganizations, useMyOrganization } from "@/hooks/use-organization";
import { OrganizationFormDialog } from "@/components/organization/OrganizationFormDialog";
import type { OrganizationCreatePayload } from "@/types/organization.type";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { formatDate } from "@/lib/datetime";

const profileFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Tên người dùng phải có ít nhất 3 ký tự")
    .max(50, "Tên người dùng không được vượt quá 50 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  bio: z.string().optional().or(z.literal("")),
  urls: z
    .array(
      z.object({
        value: z
          .string()
          .url(
            "Vui lòng nhập liên kết hợp lệ (bắt đầu bằng http:// hoặc https://)",
          ),
      }),
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function MyProfilePage() {
  const { data: currentUser, isPending: isUserPending } = useCurrentUser();
  const updateProfileMutation = useUpdateMyProfile();

  const [activeTab, setActiveTab] = useState("profile");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sidebarItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "adoptions", label: "Hồ sơ nhận nuôi", icon: HeartHandshake },
    { id: "centers", label: "Hồ sơ trung tâm", icon: Building },
    { id: "account", label: "Account", icon: Settings },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "display", label: "Display", icon: Sliders },
  ];

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      urls: [],
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "urls",
  });

  // Populate data when query succeeds or defaults to mock values if user is guest
  useEffect(() => {
    if (currentUser) {
      reset({
        username: currentUser.username || "",
        email: currentUser.email || "",
        bio: "Tôi là thành viên của PawHome.",
        urls: [
          { value: "https://pawhome.vn" },
          { value: "https://github.com/pawhome" },
        ],
      });
      if (currentUser.avatarUrl) {
        setAvatarPreview(currentUser.avatarUrl);
      }
    } else if (!isUserPending) {
      // Mock values if user is not logged in to display the layout nicely
      reset({
        username: "shadcn",
        email: "m@example.com",
        bio: "I own a computer.",
        urls: [
          { value: "https://twitter.com/shadcn" },
          { value: "https://github.com/shadcn" },
        ],
      });
    }
  }, [currentUser, isUserPending, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      toast.success("Đã chọn ảnh đại diện mới!");
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfileMutation.mutateAsync({
        username: values.username,
        avatarUrl: avatarPreview || currentUser?.avatarUrl || "",
      });
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật hồ sơ!");
      console.error(error);
    }
  };

  const renderTabContent = () => {
    if (activeTab === "adoptions") {
      return <AdoptionApplicationsTab />;
    }
    if (activeTab === "centers") {
      return <CenterProfilesTab />;
    }

    if (activeTab !== "profile") {
      const activeItem = sidebarItems.find((item) => item.id === activeTab);
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">
              {activeItem?.label} Settings
            </h3>
            <p className="text-sm text-muted-foreground">
              Configure your {activeItem?.label.toLowerCase()} preferences.
            </p>
          </div>
          <Separator />
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            Tính năng cấu hình {activeItem?.label} đang được phát triển.
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarPreview} alt="User Avatar" />
              <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                {form.getValues("username")?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <Button
              type="button"
              className="bg-black text-white hover:bg-black/90 font-medium text-xs px-4 py-2 rounded-md shadow-sm transition cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload image
            </Button>
          </div>

          <Separator />

          {/* Username Input */}
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <FieldContent>
              <Input
                id="username"
                placeholder="Username của bạn"
                {...register("username")}
                className="max-w-xl"
              />
              <FieldDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FieldDescription>
              <FieldError errors={[errors.username]} />
            </FieldContent>
          </Field>

          {/* Email Select */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="max-w-xl">
                      <SelectValue placeholder="Chọn email xác thực hiển thị" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.value ? (
                        <SelectItem value={field.value}>
                          {field.value}
                        </SelectItem>
                      ) : null}
                      <SelectItem value="verified-1@example.com">
                        verified-1@example.com
                      </SelectItem>
                      <SelectItem value="verified-2@example.com">
                        verified-2@example.com
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldDescription>
                You can manage verified email addresses in your email settings.
              </FieldDescription>
              <FieldError errors={[errors.email]} />
            </FieldContent>
          </Field>

          {/* Bio Input */}
          <Field>
            <FieldLabel htmlFor="bio">Bio</FieldLabel>
            <FieldContent>
              <Textarea
                id="bio"
                placeholder="Nhập giới thiệu bản thân..."
                {...register("bio")}
                className="max-w-xl min-h-[100px]"
              />
              <FieldDescription>
                You can @mention other users and organizations to link to them.
              </FieldDescription>
              <FieldError errors={[errors.bio]} />
            </FieldContent>
          </Field>

          {/* URLs Input List */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">URLs</label>
              <p className="text-sm text-muted-foreground mt-1">
                Add links to your website, blog, or social media profiles.
              </p>
            </div>

            <FieldGroup className="max-w-xl gap-3">
              {fields.map((field, index) => (
                <Field key={field.id}>
                  <FieldContent>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="https://example.com"
                        {...register(`urls.${index}.value` as const)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer shrink-0"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {errors.urls?.[index]?.value && (
                      <FieldError errors={[errors.urls[index]?.value]} />
                    )}
                  </FieldContent>
                </Field>
              ))}
            </FieldGroup>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-2 rounded-md hover:bg-accent border border-border cursor-pointer mt-1"
              onClick={() => append({ value: "" })}
            >
              <Plus className="h-4 w-4" />
              <span>Add URL</span>
            </Button>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending || !isDirty}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-md px-5 cursor-pointer disabled:opacity-60"
            >
              {updateProfileMutation.isPending
                ? "Đang lưu..."
                : "Update profile"}
            </Button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-10">
      <div className="space-y-0.5 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and set e-mail preferences.
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

const MOCK_ADOPTIONS = [
  {
    applicationId: "mock-1",
    adoptionCode: "AD-72819",
    petName: "Bé Miu Miu",
    petPrimaryImageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    status: "PENDING" as const,
    createdAt: "2026-05-27T10:00:00Z",
    experience: "Đã có kinh nghiệm chăm sóc mèo ta 3 năm, biết xử lý các bệnh cơ bản.",
    liveCondition: "Căn hộ chung cư rộng rãi 65m2, đã lắp lưới an toàn ban công.",
  },
  {
    applicationId: "mock-2",
    adoptionCode: "AD-52901",
    petName: "Cậu Vàng",
    petPrimaryImageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    status: "APPROVED" as const,
    createdAt: "2026-05-18T09:30:00Z",
    experience: "Từng nuôi chó và chăm sóc chu đáo, yêu động vật.",
    liveCondition: "Nhà vườn rộng rãi ở Bình Chánh, sống cùng gia đình 4 người.",
  },
  {
    applicationId: "mock-3",
    adoptionCode: "AD-38102",
    petName: "Bông Bông",
    petPrimaryImageUrl: "https://images.unsplash.com/photo-1535268647977-a403b69fc756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    status: "REJECTED" as const,
    createdAt: "2026-05-12T14:20:00Z",
    experience: "Chưa từng nuôi thú cưng, thời gian biểu bận rộn.",
    liveCondition: "Phòng trọ diện tích nhỏ 18m2, thường xuyên vắng nhà.",
  },
];

function AdoptionApplicationsTab() {
  const { data: currentUser } = useCurrentUser();
  const adoptionsQuery = useAdoptionsByUser(currentUser?.userId);
  const cancelMutation = useCancelAdoption();

  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const adoptionsList = React.useMemo(() => {
    if (!currentUser) return MOCK_ADOPTIONS;
    if (adoptionsQuery.isError) return MOCK_ADOPTIONS;
    if (
      adoptionsQuery.data &&
      adoptionsQuery.data.content &&
      adoptionsQuery.data.content.length > 0
    ) {
      return adoptionsQuery.data.content;
    }
    // Default to mock data if user is logged in but hasn't submitted any adoption forms yet
    return MOCK_ADOPTIONS;
  }, [currentUser, adoptionsQuery.data, adoptionsQuery.isError]);

  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      ALL: adoptionsList.length,
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      CANCELLED: 0,
    };
    adoptionsList.forEach((item) => {
      if (item.status in counts) {
        counts[item.status]++;
      }
    });
    return counts;
  }, [adoptionsList]);

  const filteredList = React.useMemo(() => {
    if (selectedStatus === "ALL") return adoptionsList;
    return adoptionsList.filter((item) => item.status === selectedStatus);
  }, [adoptionsList, selectedStatus]);

  const handleCancel = async (applicationId: string) => {
    if (applicationId.startsWith("mock-")) {
      toast.success("Hủy đơn nhận nuôi thành công! (Dữ liệu Mock)");
      return;
    }

    try {
      await cancelMutation.mutateAsync(applicationId);
      toast.success("Hủy đơn nhận nuôi thành công!");
    } catch (error) {
      toast.error("Hủy đơn nhận nuôi thất bại!");
      console.error(error);
    }
  };

  if (adoptionsQuery.isPending && currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">
          Đang tải danh sách hồ sơ...
        </p>
      </div>
    );
  }

  const filterPills = [
    { value: "ALL", label: "Tất cả" },
    { value: "PENDING", label: "Chờ duyệt" },
    { value: "APPROVED", label: "Đã duyệt" },
    { value: "REJECTED", label: "Đã từ chối" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Hồ sơ nhận nuôi của tôi</h3>
        <p className="text-sm text-muted-foreground">
          Xem và theo dõi trạng thái các đơn đăng ký nhận nuôi thú cưng bạn đã gửi.
        </p>
      </div>
      <Separator />

      {adoptionsList.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <HeartHandshake className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-sm text-muted-foreground font-medium">
            Bạn chưa gửi đơn nhận nuôi nào.
          </p>
          <Button asChild className="mt-4" variant="outline">
            <a href="/nhan-nuoi">Tìm kiếm thú cưng ngay</a>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
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
              <HeartHandshake className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground font-medium">
                Không có đơn nhận nuôi nào ở trạng thái này.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
          {filteredList.map((item) => {
            const isExpanded = !!expandedIds[item.applicationId];
            return (
              <div
                key={item.applicationId}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-muted shrink-0 border border-border">
                      <Image
                        src={
                          item.petPrimaryImageUrl ||
                          "https://images.unsplash.com/photo-1517849845537-4d257902454a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200"
                        }
                        alt={item.petName}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">
                        {item.petName}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 font-medium flex items-center gap-1.5">
                        <FileText className="h-3 w-3" /> Mã đơn: {item.adoptionCode}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" /> Ngày gửi:{" "}
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <StatusBadge status={item.status} />

                    {item.status === "PENDING" && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={cancelMutation.isPending}
                        onClick={() => handleCancel(item.applicationId)}
                        className="text-xs border-destructive/30 hover:border-destructive hover:bg-destructive/10 text-destructive rounded-xl h-8 cursor-pointer px-3"
                      >
                        Hủy đơn
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60">
                  <button
                    onClick={() => toggleExpand(item.applicationId)}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition cursor-pointer select-none"
                  >
                    <span>
                      {isExpanded ? "Thu gọn chi tiết" : "Xem chi tiết đơn gửi"}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-3 bg-muted/40 p-4 rounded-xl text-sm leading-relaxed text-slate-600">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Kinh nghiệm chăm sóc
                        </p>
                        <p className="mt-1 font-medium text-slate-700">
                          {item.experience || "Chưa cập nhật thông tin."}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Điều kiện sống & Môi trường
                        </p>
                        <p className="mt-1 font-medium text-slate-700">
                          {item.liveCondition || "Chưa cập nhật thông tin."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
          <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
          Chờ duyệt
        </span>
      );
    case "APPROVED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          Đã duyệt
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200">
          <XCircle className="h-3.5 w-3.5 text-red-500" />
          Đã từ chối
        </span>
      );
    case "CANCELLED":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
          <XCircle className="h-3.5 w-3.5 text-slate-400" />
          Đã hủy
        </span>
      );
  }
}

interface MockCenterItem {
  organizationId: string;
  name: string;
  type: "SHELTER" | "VET_CENTER";
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  streetAddress: string;
  wardName: string;
  provinceName: string;
  phone: string;
  email: string;
  officialLink: string;
  description: string;
  imageUrl: string;
}

const MOCK_CENTERS: MockCenterItem[] = [
  {
    organizationId: "org-mock-1",
    name: "Mái ấm Paw Home Bình Chánh",
    type: "SHELTER",
    status: "ACTIVE",
    streetAddress: "Đường số 10, Xã Bình Hưng",
    wardName: "Xã Bình Hưng",
    provinceName: "Huyện Bình Chánh, TP.HCM",
    phone: "0901234567",
    email: "contact@pawhome-binhchanh.vn",
    officialLink: "https://pawhome-binhchanh.vn",
    description: "Cơ sở cứu hộ và chăm sóc chó mèo lang thang bị bỏ rơi khu vực Bình Chánh.",
    imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    organizationId: "org-mock-2",
    name: "Phòng khám Thú y Paw Care Quận 7",
    type: "VET_CENTER",
    status: "PENDING",
    streetAddress: "Số 45, Đường Nguyễn Thị Thập",
    wardName: "Phường Tân Hưng",
    provinceName: "Quận 7, TP.HCM",
    phone: "0909876543",
    email: "clinic-q7@pawhome.vn",
    officialLink: "https://pawcare-q7.vn",
    description: "Đang chờ admin xét duyệt giấy phép hoạt động và cơ sở vật chất.",
    imageUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  }
];

function CenterProfilesTab() {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const createMutation = useCreateOrganization();
  const myOrgQuery = useMyOrganization();
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const centers = React.useMemo(() => {
    if (!currentUser) return MOCK_CENTERS;
    
    if (myOrgQuery.isError) {
      return MOCK_CENTERS;
    }
    
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
          imageUrl: org.imageUrl || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        }
      ];
    }
    
    if (myOrgQuery.isSuccess && !myOrgQuery.data?.organization) {
      return [];
    }

    return MOCK_CENTERS;
  }, [currentUser, myOrgQuery.data, myOrgQuery.isError, myOrgQuery.isSuccess]);

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

