"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { UserListTable } from "@/components/user/UserListTable";
import { UserViewDetail } from "@/components/user/UserViewDetail";
import {
  getOptionalSearchParam,
  useListUrlState,
} from "@/hooks/use-list-url-state";
import userService from "@/services/user/user";

export default function UsersManagementPage() {
  const { searchParams, page, size, setParams, setPage, setSize } =
    useListUrlState();

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const keyword = getOptionalSearchParam(searchParams.get("keyword")) ?? "";

  const queryKey = useMemo(
    () => ["users", { page, size }],
    [page, size],
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
        keyword={keyword}
        onPageChange={setPage}
        onSizeChange={setSize}
        onKeywordChange={(nextKeyword) =>
          setParams({ keyword: nextKeyword.trim(), page: 1 })
        }
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
