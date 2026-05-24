"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CheckCircle2, ShieldCheck, UserRound } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";
import {
  profileDefaultValues,
  profileSchema,
  type ProfileFormValues,
} from "@/lib/schemas/profile";
import { queryKeys } from "@/lib/query-keys";
import userService from "@/services/user/user";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

function statusToLabel(status?: string) {
  switch (status) {
    case "ACTIVE":
      return "Hoạt động";
    case "DISABLED":
      return "Vô hiệu";
    case "PENDING_VERIFICATION":
      return "Chờ xác minh";
    default:
      return status || "Không rõ";
  }
}

function getInitials(name?: string, fallback = "U") {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? fallback) + (parts[1]?.[0] ?? "")).toUpperCase();
}

function readOnlyValue(value?: string) {
  return value?.trim() ? value : "Chưa cập nhật";
}

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const currentUserQuery = useCurrentUser();
  const currentUser = currentUserQuery.data;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileDefaultValues,
  });

  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
  } = form;

  React.useEffect(() => {
    if (!currentUser) return;

    reset({
      userName: currentUser.username ?? "",
      avatarUrl: "",
    });
  }, [currentUser, reset]);

  if (currentUserQuery.isPending) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trang cá nhân</h1>
          <p className="font-medium text-muted-foreground">
            Đang tải thông tin tài khoản...
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="h-96 rounded-xl border border-border bg-card animate-pulse" />
          <div className="h-96 rounded-xl border border-border bg-card animate-pulse" />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Trang cá nhân</h1>
        <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
          Không tải được thông tin người dùng hiện tại.
        </div>
      </div>
    );
  }

  const rolesText =
    Array.isArray(currentUser.roles) && currentUser.roles.length > 0
      ? currentUser.roles.join(", ")
      : "Chưa có role";

  const avatarFallback = getInitials(
    currentUser.fullName || currentUser.username,
    "U",
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Trang cá nhân</h1>
        <p className="font-medium text-muted-foreground">
          Xem thông tin tài khoản hiện tại và cập nhật profile từ API user/me.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border bg-gradient-to-br from-slate-50 via-white to-emerald-50">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar size="lg" className="h-20 w-20">
                <AvatarImage src="" alt={currentUser.username} />
                <AvatarFallback className="text-lg font-semibold">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-3">
                <div>
                  <CardTitle className="text-2xl">
                    {currentUser.fullName || currentUser.username}
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm">
                    @{currentUser.username} • {currentUser.email}
                  </CardDescription>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                    <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                    {statusToLabel(currentUser.status)}
                  </Badge>
                  <Badge variant="secondary">
                    <UserRound className="mr-1 h-3.5 w-3.5" />
                    {currentUser.organizationRole || "Không có vai trò tổ chức"}
                  </Badge>
                  <Badge
                    variant={currentUser.emailVerified ? "default" : "outline"}
                  >
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                    {currentUser.emailVerified
                      ? "Đã xác minh email"
                      : "Chưa xác minh email"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  User ID
                </div>
                <div className="mt-2 break-all font-mono text-sm">
                  {currentUser.userId}
                </div>
              </div>
              <div className="rounded-xl border border-border p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Roles
                </div>
                <div className="mt-2 text-sm">{rolesText}</div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  So dien thoai
                </div>
                <div className="mt-2 text-sm">
                  {readOnlyValue(currentUser.phone)}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Gioi tinh
                </div>
                <div className="mt-2 text-sm">
                  {readOnlyValue(currentUser.gender)}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  To chuc
                </div>
                <div className="mt-2 text-sm">
                  {readOnlyValue(currentUser.organizationName)}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Organization ID
                </div>
                <div className="mt-2 break-all font-mono text-sm">
                  {readOnlyValue(currentUser.organizationId)}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Dia chi
                </div>
                <div className="mt-2 text-sm">
                  {readOnlyValue(currentUser.streetAddress)}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Phường / Xã
                </div>
                <div className="mt-2 text-sm">
                  {readOnlyValue(currentUser.wardName)}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Tỉnh / Thành
                </div>
                <div className="mt-2 text-sm">
                  {readOnlyValue(currentUser.provinceName)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
