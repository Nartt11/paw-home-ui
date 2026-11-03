"use client";

import { useState } from "react";

import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { UserListTable } from "@/components/user/UserListTable";
import { UserViewDetail } from "@/components/user/UserViewDetail";
import {
  getOptionalSearchParam,
  useListUrlState,
} from "@/hooks/use-list-url-state";
import { useUserDetail, useUsers } from "@/hooks/use-user";
import { PageControls } from "@/components/common/PageControl";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function UsersManagementPage() {
  const { searchParams, page, size, setParams, setPage, setSize } =
    useListUrlState();

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const keyword = getOptionalSearchParam(searchParams.get("keyword")) ?? "";
  const usersQuery = useUsers({ page, pageSize: size });
  const userDetailQuery = useUserDetail(selectedId ?? undefined);

  const data = usersQuery.data;
  const userDetail = openDetail ? userDetailQuery.data : undefined;

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

      {usersQuery.isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {(usersQuery.error as Error)?.message ||
            "Không thể tải dữ liệu người dùng."}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Tìm người dùng..."
            value={keyword}
            onChange={(e) => setParams({ keyword: e.target.value, page: 0 })}
            className="pl-9"
          />
        </div>
      </div>

      <UserListTable
        data={data?.content ?? []}
        loading={usersQuery.isPending}
        keyword={keyword}
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

      <PageControls
        page={data?.page ?? page}
        pageSize={data?.size ?? size}
        totalPages={data?.totalPages || 0}
        totalItems={data?.totalElements}
        onPageChange={setPage}
        onPageSizeChange={setSize}
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
