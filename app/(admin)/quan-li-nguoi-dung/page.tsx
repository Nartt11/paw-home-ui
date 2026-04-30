"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { UserListTable } from "@/components/user/UserListTable";
import { UserViewDetail } from "@/components/user/UserViewDetail";
import userService from "@/services/user/user";

export default function UsersManagementPage() {
  const queryParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const page = Number(queryParams.get("page") || 1);
  const size = Number(queryParams.get("size") || 10);

  const setQueryParams = (
    patch: Record<string, string | number | undefined | null>,
  ) => {
    const next = new URLSearchParams(queryParams.toString());

    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") next.delete(k);
      else next.set(k, String(v));
    });

    router.replace(`${pathname}?${next.toString()}`);
  };

  const queryKey = useMemo(
    () => ["users", queryParams.toString()],
    [queryParams],
  );

  const { data, isPending, isError, error } = useQuery({
    queryKey,
    queryFn: () => userService.getAllUsers({ page, size }),
  });

  const { data: userDetail } = useQuery({
    queryKey: ["user", selectedId],
    queryFn: () => userService.getUserById(selectedId!),
    enabled: !!selectedId && openDetail,
  });

  return (
    <div className="space-y-6">
      <TitlePerPage
        title="Quản lý người dùng"
        description="Danh sách người dùng trong hệ thống"
        buttonText="Thêm người dùng"
        handleOpenModal={() => {
          // TODO: implement create user dialog
        }}
      />

      {isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {(error as Error)?.message || "Không thể tải dữ liệu người dùng."}
        </div>
      ) : null}

      <UserListTable
        data={data?.content ?? []}
        loading={isPending}
        page={page}
        size={size}
        totalElements={data?.totalElements}
        totalPages={data?.totalPages}
        onPageChange={(nextPage) => setQueryParams({ page: nextPage })}
        onSizeChange={(nextSize) => setQueryParams({ size: nextSize, page: 1 })}
        onViewDetail={(userId) => {
          setSelectedId(userId);
          setOpenDetail(true);
        }}
        onEdit={(userId) => {
          // TODO: open edit dialog
          console.log("edit", userId);
        }}
        onDisable={(userId) => {
          // TODO: call disable user API
          console.log("disable", userId);
        }}
      />

      {userDetail ? (
        <UserViewDetail
          open={openDetail}
          onOpenChange={(open) => {
            setOpenDetail(open);
            if (!open) setSelectedId(null);
          }}
          user={userDetail}
        />
      ) : null}
    </div>
  );
}
