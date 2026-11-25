"use client";

import { CheckCircle2Icon, MailWarningIcon } from "lucide-react";

import { ProfileForm } from "@/components/user/ProfileForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { organizationRoleLabel } from "@/lib/organization-display";
import { userStatusBadge, userStatusLabel } from "@/lib/user-display";

const SYSTEM_ROLE_LABEL: Record<string, string> = {
  ADMIN: "Quản trị viên",
  USER: "Người dùng",
  MEMBER: "Thành viên tổ chức",
};

function initials(name?: string) {
  return ((name ?? "").trim().split(/\s+/).at(-1)?.[0] ?? "?").toUpperCase();
}

/** The staff member's own account: edit the profile on the left, see roles and organization on the right. */
export default function ProfilePage() {
  const { data: user, isPending } = useCurrentUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Trang cá nhân</h1>
        <p className="text-muted-foreground">Tên hiển thị, ảnh và cách liên hệ với bạn.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Hồ sơ</CardTitle>
            <CardDescription>Mọi người thấy tên hiển thị, không thấy tên đăng nhập của bạn.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardContent className="space-y-4 pt-6">
            {isPending || !user ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <Avatar className="size-14">
                    {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
                    <AvatarFallback className="font-semibold">{initials(user.fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{user.fullName}</div>
                    <div className="truncate text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Trạng thái</dt>
                    <dd className="mt-1">
                      <Badge variant="outline" className={userStatusBadge(user.status)}>{userStatusLabel(user.status)}</Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Vai trò hệ thống</dt>
                    <dd className="mt-1">
                      {user.roles?.length ? user.roles.map((r) => SYSTEM_ROLE_LABEL[r] ?? r).join(", ") : "Chưa có vai trò"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Tổ chức</dt>
                    <dd className="mt-1">
                      {user.organizationName
                        ? `${user.organizationName} · ${organizationRoleLabel(user.organizationRole)}`
                        : "Không thuộc tổ chức nào"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Email</dt>
                    <dd className="mt-1 flex items-center gap-1.5">
                      {user.emailVerified ? (
                        <><CheckCircle2Icon className="size-4 text-emerald-700" aria-hidden /> Đã xác minh</>
                      ) : (
                        <><MailWarningIcon className="size-4 text-amber-700" aria-hidden /> Chưa xác minh</>
                      )}
                    </dd>
                  </div>
                </dl>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
