"use client";

import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { DeleteModal } from "@/components/common/admin/DeleteModal";
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
import organizationService from "@/services/organization/organization";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export default function CenterManagementPage() {
  const { searchParams, page, size, setParams, setPage, setSize } =
    useListUrlState();
  const queryClient = useQueryClient();

  const status = getOptionalSearchParam(searchParams.get("status"));
  const keyword = getOptionalSearchParam(searchParams.get("keyword")) ?? "";

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const queryKey = useMemo(
    () => ["organizations", { page, size, status }],
    [page, size, status],
  );

  // list
  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      organizationService.getAllOrganizations({
        page,
        size,
        status,
      }),
  });

  // detail
  const { data: organization } = useQuery({
    queryKey: ["organization", selectedId],
    queryFn: () => organizationService.getOrganizationById(selectedId!),
    enabled: !!selectedId,
  });

  // update detail
  const { data: updateOrganization } = useQuery({
    queryKey: ["organization", selectedId],
    queryFn: () => organizationService.getOrganizationById(selectedId!),
    enabled: !!selectedId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => organizationService.deactivateOrganization(id),
    onSuccess: async () => {
      setOpenDelete(false);
      setDeleteId(null);
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  const createMutation = useMutation({
    mutationFn: (values: OrganizationCreateNewValues) => {
      if (!values.name.trim()) throw new Error("Tên trung tâm là bắt buộc");
      if (!values.type) throw new Error("Loại trung tâm là bắt buộc");

      const latitude = values.latitude.trim()
        ? Number(values.latitude)
        : undefined;
      const longitude = values.longitude.trim()
        ? Number(values.longitude)
        : undefined;

      return organizationService.createOrganization({
        name: values.name.trim(),
        type: values.type,
        description: values.description.trim() || undefined,
        email: values.email.trim() || undefined,
        phone: values.phone.trim() || undefined,
        officialLink: values.officialLink.trim() || undefined,
        streetAddress: values.streetAddress.trim() || undefined,
        wardName: values.wardName.trim() || undefined,
        provinceName: values.provinceName.trim() || undefined,
        latitude: Number.isFinite(latitude) ? latitude : undefined,
        longitude: Number.isFinite(longitude) ? longitude : undefined,
      });
    },
    onSuccess: async () => {
      setOpenCreate(false);
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: OrganizationUpdateValues) => {
      if (!selectedId) throw new Error("Missing updateId");
      if (!values.name.trim()) throw new Error("Tên trung tâm là bắt buộc");
      if (!values.type) throw new Error("Loại trung tâm là bắt buộc");

      const latitude = values.latitude.trim()
        ? Number(values.latitude)
        : undefined;
      const longitude = values.longitude.trim()
        ? Number(values.longitude)
        : undefined;

      return organizationService.updateOrganization(selectedId, {
        name: values.name.trim(),
        type: values.type,
        description: values.description.trim() || undefined,
        email: values.email.trim() || undefined,
        phone: values.phone.trim() || undefined,
        officialLink: values.officialLink.trim() || undefined,
        streetAddress: values.streetAddress.trim() || undefined,
        wardName: values.wardName.trim() || undefined,
        provinceName: values.provinceName.trim() || undefined,
        latitude: Number.isFinite(latitude) ? latitude : undefined,
        longitude: Number.isFinite(longitude) ? longitude : undefined,
        status: values.status?.trim() || undefined,
      });
    },
    onSuccess: async () => {
      setOpenUpdate(false);
      setSelectedId(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey }),
        queryClient.invalidateQueries({ queryKey: ["organization"] }),
      ]);
    },
  });

  const handleOpenViewDetail = (organizationId: string) => {
    setSelectedId(organizationId);
    setOpenDetail(true);
  };

  const handleOpenUpdate = (organizationId: string) => {
    setSelectedId(organizationId);
    setOpenUpdate(true);
  };

  const handleOpenDelete = (organizationId: string) => {
    setDeleteId(organizationId);
    setOpenDelete(true);
  };

  const organizationTableData = {
    data: data?.content ?? [],
    page,
    size,
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 0,
  };

  return (
    <div className="space-y-6">
      <TitlePerPage
        title="Quản lý trung tâm"
        description="Hệ thống các mái ấm và cơ sở cứu hộ động vật đối tác"
        buttonText="Thêm trung tâm"
        handleOpenModal={() => setOpenCreate(true)}
      />
      {/* log chỉ số tổng quan */}
      {/* Đanh sách yêu cầu */}

      {/* card danh sách trung tâm đang hoạt động */}

      
        <OrganizationListTable
          data={organizationTableData.data}
          onViewDetail={handleOpenViewDetail}
          onEdit={handleOpenUpdate}
          onDelete={handleOpenDelete}
          page={page}
          size={size}
          totalElements={organizationTableData.totalElements}
          totalPages={organizationTableData.totalPages}
          keyword={keyword}
          onPageChange={setPage}
          onSizeChange={setSize}
          onKeywordChange={(nextKeyword) =>
            setParams({ keyword: nextKeyword.trim(), page: 1 })
          }
        />
      

      {organization && (
        <OrganizationViewDetail
          open={openDetail}
          onOpenChange={setOpenDetail}
          organization={organization}
        />
      )}

      <OrganizationCreateNew
        open={openCreate}
        onOpenChange={setOpenCreate}
        submitting={createMutation.isPending}
        onSubmit={(values) => createMutation.mutate(values)}
      />

      <OrganizationUpdate
        open={openUpdate}
        onOpenChange={(v) => {
          setOpenUpdate(v);
          if (!v) setSelectedId(null);
        }}
        organization={updateOrganization}
        submitting={updateMutation.isPending}
        onSubmit={(values) => updateMutation.mutate(values)}
      />

      <DeleteModal
        open={openDelete}
        onOpenChange={(v) => {
          setOpenDelete(v);
          if (!v) setDeleteId(null);
        }}
        title="Xoá trung tâm"
        description="Bạn có chắc chắn muốn xoá trung tâm này? Hành động này không thể hoàn tác."
        warningText="Lưu ý: Đây là xoá mềm (deactivate)."
        confirmText="Xoá"
        confirming={deleteMutation.isPending}
        confirmDisabled={!deleteId}
        onConfirm={() => {
          if (!deleteId) return;
          deleteMutation.mutate(deleteId);
        }}
      />
    </div>
  );
}
