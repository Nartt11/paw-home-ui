"use client";

import { isOrganizationMember } from "@/lib/permission";
import * as React from "react";

import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { PageControls } from "@/components/common/PageControl";
import { KpiCard } from "@/components/common/admin/KpiCard";
import { PetCreateNew } from "@/components/pet/PetCreateNew";
import { PetListTable } from "@/components/pet/PetListTable";
import { useListUrlState } from "@/hooks/use-list-url-state";
import { useOrganizations } from "@/hooks/use-organization";
import { useCreatePet, usePets, usePetsByOrganization } from "@/hooks/use-pet";
import type { PetCreatePayload, PetStatus } from "@/types/pet.type";
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

/**
 * How many pets have a status, across every page: one tiny request (pageSize 1) whose
 * totalElements is the count. Statuses other than AVAILABLE need an admin or a member.
 */
function usePetCount(
  filter: { status?: PetStatus; healthStatus?: string },
  organizationId: string | undefined,
  enabled: boolean,
) {
  const query = usePets(
    {
      page: 0,
      pageSize: 1,
      ...(filter.status ? { status: [filter.status] } : {}),
      ...(filter.healthStatus ? { healthStatus: filter.healthStatus } : {}),
      ...(organizationId ? { organizationId } : {}),
    },
    { enabled },
  );
  return query.data?.totalElements;
}

export default function PetManagementPage() {
  const { page, size, setPage, setSize } = useListUrlState();
  const [createOpen, setCreateOpen] = React.useState(false);
  
  const { data: currentUser } = useCurrentUser();
  // By organization role: some accounts have no MEMBER system role (production demo accounts have none).
  const isOrganizationUser = isOrganizationMember(currentUser);

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
  const countScope = isOrganizationUser ? currentUser?.organizationId : undefined;
  const countsEnabled = !isOrganizationUser || !!currentUser?.organizationId;
  const kpis = {
    total: data?.totalElements,
    pending: usePetCount({ status: "AVAILABLE" }, countScope, countsEnabled),
    adopted: usePetCount({ status: "ADOPTED" }, countScope, countsEnabled),
    fostered: usePetCount({ status: "FOSTERING" }, countScope, countsEnabled),
    // every page, not just the rows on screen (GET /pets?healthStatus=)
    healthAlert: usePetCount({ healthStatus: "UNDER_TREATMENT" }, countScope, countsEnabled),
  };

  const ownOrganizationId = isOrganizationUser ? currentUser?.organizationId : undefined;
  const filteredOrganizations = React.useMemo(() => {
    const orgs = organizationsQuery.data?.content ?? [];
    return ownOrganizationId ? orgs.filter((o) => o.organizationId === ownOrganizationId) : orgs;
  }, [organizationsQuery.data?.content, ownOrganizationId]);

  const handleCreatePet = React.useCallback(
    async (payload: Partial<PetCreatePayload>) => {
      try {
        // a centre's staff always add pets to their own centre
        const finalPayload = ownOrganizationId ? { ...payload, shelterId: ownOrganizationId } : { ...payload };
        await createPetMutation.mutateAsync(finalPayload);
        setCreateOpen(false);
        toast.success("Tạo thú cưng thành công");
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
    [createPetMutation, ownOrganizationId],
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <KpiCard label="Tổng số thú cưng" value={kpis.total} icon={PawPrint} />
          <KpiCard label="Chờ nhận nuôi" value={kpis.pending} icon={Heart} />
          <KpiCard label="Đã có chủ" value={kpis.adopted} icon={CheckCircle2} />
          <KpiCard label="Đang chăm sóc" value={kpis.fostered} icon={ShieldAlert} />
          <KpiCard label="Đang điều trị" value={kpis.healthAlert} icon={AlertTriangle} tone="warning" />
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
