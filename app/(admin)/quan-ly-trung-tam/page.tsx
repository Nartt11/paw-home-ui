"use client";

import { useCallback, useState } from "react";

import { DeleteModal } from "@/components/common/admin/DeleteModal";
import TitlePerPage from "@/components/common/admin/TitlePerPage";
import {
  OrganizationCreateNew,
  type OrganizationCreateNewValues,
} from "@/components/organization/OrganizationCreateNew";
import { OrganizationListTable } from "@/components/organization/OrganizationListTable";
import {
  OrganizationUpdate,
  type OrganizationUpdateValues,
} from "@/components/organization/OrganizationUpdate";
import { OrganizationViewDetail } from "@/components/organization/OrganizationViewDetail";
import {
  getOptionalSearchParam,
  useListUrlState,
} from "@/hooks/use-list-url-state";
import {
  useCreateOrganization,
  useDeactivateOrganization,
  useOrganizationDetail,
  useOrganizations,
  useUpdateOrganization,
} from "@/hooks/use-organization";
import type {
  OrganizationCreatePayload,
  OrganizationUpdatePayload,
} from "@/types/organization.type";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageControls } from "@/components/common/PageControl";

function parseCoordinate(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toOptionalTrimmed(value: string) {
  const v = value.trim();
  return v ? v : undefined;
}

function toCreateOrganizationPayload(
  values: OrganizationCreateNewValues,
): OrganizationCreatePayload {
  const latitude = parseCoordinate(values.latitude);
  const longitude = parseCoordinate(values.longitude);

  return {
    name: values.name.trim(),
    type: values.type,
    description: values.description.trim() || "",
    email: toOptionalTrimmed(values.email) ?? "",
    phone: toOptionalTrimmed(values.phone) ?? "",
    officialLink: toOptionalTrimmed(values.officialLink) ?? "",
    streetAddress: toOptionalTrimmed(values.streetAddress) ?? "",

    // tạm thời cho nhập tay / chọn từ map
    wardCode: "",
    wardName: toOptionalTrimmed(values.wardName) ?? "",
    provinceCode: "",
    provinceName: toOptionalTrimmed(values.provinceName) ?? "",

    imageUrl: "",
    latitude: latitude ?? 0,
    longitude: longitude ?? 0,
  };
}

function toUpdateOrganizationPayload(
  values: OrganizationUpdateValues,
): OrganizationUpdatePayload {
  const latitude = parseCoordinate(values.latitude);
  const longitude = parseCoordinate(values.longitude);

  return {
    name: values.name.trim(),
    type: values.type,
    description: values.description.trim() || "",
    email: toOptionalTrimmed(values.email) ?? "",
    phone: toOptionalTrimmed(values.phone) ?? "",
    officialLink: toOptionalTrimmed(values.officialLink) ?? "",
    streetAddress: toOptionalTrimmed(values.streetAddress) ?? "",

    // tạm thời cho nhập tay / chọn từ map
    wardCode: "",
    wardName: toOptionalTrimmed(values.wardName) ?? "",
    provinceCode: "",
    provinceName: toOptionalTrimmed(values.provinceName) ?? "",

    imageUrl: "",
    latitude: latitude ?? 0,
    longitude: longitude ?? 0,
  };
}

export default function CenterManagementPage() {
  const { searchParams, page, size, setParams, setPage, setSize } =
    useListUrlState();

  const statusParam = getOptionalSearchParam(searchParams.get("status"));
  const keyword = getOptionalSearchParam(searchParams.get("keyword")) ?? "";
  const status = statusParam ? [statusParam] : undefined;

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const organizationsQuery = useOrganizations({
    page,
    size,
    status,
  });
  const organizationDetailQuery = useOrganizationDetail(
    selectedId ?? undefined,
  );
  const createOrganizationMutation = useCreateOrganization();
  const updateOrganizationMutation = useUpdateOrganization();
  const deactivateOrganizationMutation = useDeactivateOrganization();

  const data = organizationsQuery.data;
  const selectedOrganization = organizationDetailQuery.data ?? null;

  const handleCreateOrganization = useCallback(
    (values: OrganizationCreateNewValues) => {
      if (!values.name.trim()) throw new Error("Tên trung tâm là bắt buộc");
      if (!values.type) throw new Error("Loại trung tâm là bắt buộc");

      createOrganizationMutation.mutate(toCreateOrganizationPayload(values), {
        onSuccess: () => {
          setOpenCreate(false);
        },
      });
    },
    [createOrganizationMutation],
  );

  const handleUpdateOrganization = useCallback(
    (values: OrganizationUpdateValues) => {
      if (!selectedId) throw new Error("Missing updateId");
      if (!values.name.trim()) throw new Error("Tên trung tâm là bắt buộc");
      if (!values.type) throw new Error("Loại trung tâm là bắt buộc");

      updateOrganizationMutation.mutate(
        {
          id: selectedId,
          payload: toUpdateOrganizationPayload(values),
        },
        {
          onSuccess: () => {
            setOpenUpdate(false);
            setSelectedId(null);
          },
        },
      );
    },
    [selectedId, updateOrganizationMutation],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!deleteId) return;

    deactivateOrganizationMutation.mutate(deleteId, {
      onSuccess: () => {
        setOpenDelete(false);
        setDeleteId(null);
      },
    });
  }, [deactivateOrganizationMutation, deleteId]);

  return (
    <div className="space-y-6">
      <TitlePerPage
        title="Quản lý trung tâm"
        description="Hệ thống các mái ấm và cơ sở cứu hộ động vật đối tác"
        buttonText="Thêm trung tâm"
        handleOpenModal={() => setOpenCreate(true)}
      />

      <div className="relative w-full md:max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

        <Input
          placeholder="Tìm tổ chức..."
          value={keyword}
          onChange={(e) => setParams({ keyword: e.target.value, page: 1 })}
          className="pl-9"
        />
      </div>

      <OrganizationListTable
        data={data?.content ?? []}
        loading={organizationsQuery.isPending}
        onViewDetail={(organizationId) => {
          setSelectedId(organizationId);
          setOpenDetail(true);
        }}
        onEdit={(organizationId) => {
          setSelectedId(organizationId);
          setOpenUpdate(true);
        }}
        onDelete={(organizationId) => {
          setDeleteId(organizationId);
          setOpenDelete(true);
        }}
        
      />

      <PageControls
        page={page}
        pageSize={size}
        totalPages={data?.totalPages || 0}
        totalItems={data?.totalElements}
        onPageChange={setPage}
        onPageSizeChange={setSize}
      />

      {selectedOrganization && (
        <OrganizationViewDetail
          open={openDetail}
          onOpenChange={(open) => {
            setOpenDetail(open);
            if (!open) {
              setSelectedId(null);
            }
          }}
          organization={selectedOrganization}
        />
      )}

      <OrganizationCreateNew
        open={openCreate}
        onOpenChange={setOpenCreate}
        submitting={createOrganizationMutation.isPending}
        onSubmit={handleCreateOrganization}
      />

      <OrganizationUpdate
        open={openUpdate}
        onOpenChange={(open) => {
          setOpenUpdate(open);
          if (!open) {
            setSelectedId(null);
          }
        }}
        organization={selectedOrganization}
        submitting={updateOrganizationMutation.isPending}
        onSubmit={handleUpdateOrganization}
      />

      <DeleteModal
        open={openDelete}
        onOpenChange={(open) => {
          setOpenDelete(open);
          if (!open) {
            setDeleteId(null);
          }
        }}
        title="Xóa trung tâm"
        description="Bạn có chắc chắn muốn xóa trung tâm này? Hành động này không thể hoàn tác."
        warningText="Lưu ý: Đây là xóa mềm (deactivate)."
        confirmText="Xóa"
        confirming={deactivateOrganizationMutation.isPending}
        confirmDisabled={!deleteId}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
