"use client";

import * as React from "react";

import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { PageControls } from "@/components/common/PageControl";
import KPICardPet from "@/components/pet/KPICardPet";
import { PetCreateNew } from "@/components/pet/PetCreateNew";
import { PetListTable } from "@/components/pet/PetListTable";
import { useListUrlState } from "@/hooks/use-list-url-state";
import { useOrganizations } from "@/hooks/use-organization";
import { useCreatePet, usePets, usePetsByOrganization } from "@/hooks/use-pet";
import type { PetCreatePayload, PetSummary } from "@/types/pet.type";
import {
  AlertTriangle,
  CheckCircle2,
  Heart,
  PawPrint,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import RequireAuth from "@/components/auth/RequireAuth";
import { SYSTEM_ROLES, ORGANIZATION_ROLES } from "@/constants/roles";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Có lỗi xảy ra";
}

function getKpis(pets: PetSummary[], totalItems: number) {
  return pets.reduce(
    (acc, pet) => {
      if (pet.status === "AVAILABLE") acc.pending += 1;
      if (pet.status === "ADOPTED") acc.adopted += 1;
      if (pet.status === "FOSTERING") acc.fostered += 1;
      if (pet.healthStatus !== "HEALTHY") acc.healthAlert += 1;
      return acc;
    },
    {
      total: totalItems,
      pending: 0,
      adopted: 0,
      fostered: 0,
      healthAlert: 0,
    },
  );
}

export default function PetManagementPage() {
  const { page, size, setPage, setSize } = useListUrlState();
  const [createOpen, setCreateOpen] = React.useState(false);
  
  const { data: currentUser } = useCurrentUser();
  const isOrganizationUser = currentUser?.roles.includes("MEMBERSHIP") && !!currentUser?.organizationRole;

  const canCreate = React.useMemo(() => {
    if (!isOrganizationUser) return true;
    return currentUser?.organizationRole === ORGANIZATION_ROLES.OWNER || currentUser?.organizationRole === ORGANIZATION_ROLES.STAFF;
  }, [isOrganizationUser, currentUser?.organizationRole]);

  const petsQuery = usePets(
    { page, pageSize: size },
    { enabled: !isOrganizationUser }
  );

  const orgPetsQuery = usePetsByOrganization(
    currentUser?.organizationId,
    { page, pageSize: size },
    { enabled: isOrganizationUser && !!currentUser?.organizationId }
  );

  const listQuery = isOrganizationUser ? orgPetsQuery : petsQuery;
  const createPetMutation = useCreatePet();
  const organizationsQuery = useOrganizations({
    page: 0,
    pageSize: 100,
    status: ["ACTIVE"],
  });

  const data = listQuery.data;
  const pets = React.useMemo(() => data?.content ?? [], [data?.content]);
  const kpis = React.useMemo(
    () => getKpis(pets, data?.totalElements ?? 0),
    [data?.totalElements, pets],
  );

  const filteredOrganizations = React.useMemo(() => {
    const orgs = organizationsQuery.data?.content ?? [];
    if (isOrganizationUser && currentUser?.organizationId) {
      return orgs.filter(o => o.organizationId === currentUser.organizationId);
    }
    return orgs;
  }, [organizationsQuery.data?.content, isOrganizationUser, currentUser?.organizationId]);

  const handleCreatePet = React.useCallback(
    async (payload: Partial<PetCreatePayload>) => {
      try {
        const finalPayload = { ...payload };
        if (isOrganizationUser && currentUser?.organizationId) {
          finalPayload.shelterId = currentUser.organizationId;
        }
        await createPetMutation.mutateAsync(finalPayload);
        setCreateOpen(false);
        toast.success("Tạo thú cưng thành công");
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
    [createPetMutation, isOrganizationUser, currentUser?.organizationId],
  );

  return (
    <RequireAuth
      allowedSystemRoles={[SYSTEM_ROLES.ADMIN]}
      allowedOrganizationRoles={[
        ORGANIZATION_ROLES.OWNER,
        ORGANIZATION_ROLES.STAFF,
        ORGANIZATION_ROLES.MEMBER,
      ]}
    >
      <div className="space-y-6">
        <TitlePerPage
          title="Quản lý thú cưng"
          description="Quản trị toàn bộ dữ liệu thú cưng trong hệ thống"
          buttonText={canCreate ? "Thêm thú cưng" : undefined}
          handleOpenModal={() => setCreateOpen(true)}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <KPICardPet
            title="Tổng số thú cưng"
            value={kpis.total}
            icon={PawPrint}
            color="text-blue-600 bg-blue-50"
          />
          <KPICardPet
            title="Chờ nhận nuôi"
            value={kpis.pending}
            icon={Heart}
            color="text-primary bg-primary/5"
          />
          <KPICardPet
            title="Đã có chủ"
            value={kpis.adopted}
            icon={CheckCircle2}
            color="text-green-600 bg-green-50"
          />
          <KPICardPet
            title="Đang cứu trợ"
            value={kpis.fostered}
            icon={ShieldAlert}
            color="text-amber-600 bg-amber-50"
          />
          <KPICardPet
            title="Cảnh báo sức khỏe"
            value={kpis.healthAlert}
            icon={AlertTriangle}
            color="text-red-600 bg-red-50"
          />
        </div>

        <PetListTable data={pets} loading={listQuery.isPending} />

        <PageControls
          page={data?.page ?? page}
          pageSize={data?.size ?? size}
          totalPages={data?.totalPages ?? 1}
          totalItems={data?.totalElements ?? 0}
          onPageChange={setPage}
          onPageSizeChange={setSize}
        />

        <PetCreateNew
          open={createOpen}
          onOpenChange={setCreateOpen}
          submitting={createPetMutation.isPending}
          organizations={filteredOrganizations}
          onSubmit={handleCreatePet}
        />
      </div>
    </RequireAuth>
  );
}
