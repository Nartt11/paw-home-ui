"use client";

import * as React from "react";

import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { PageControls } from "@/components/common/PageControl";
import KPICardPet from "@/components/pet/KPICardPet";
import { PetCreateNew } from "@/components/pet/PetCreateNew";
import { PetListTable } from "@/components/pet/PetListTable";
import { useListUrlState } from "@/hooks/use-list-url-state";
import { useOrganizations } from "@/hooks/use-organization";
import { useCreatePet, useCreatePetByShelter, usePets } from "@/hooks/use-pet";
import type { PetCreatePayload, PetSummary } from "@/types/pet.type";
import {
  AlertTriangle,
  CheckCircle2,
  Heart,
  PawPrint,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Có lỗi xảy ra";
}

function getKpis(pets: PetSummary[], totalItems: number) {
  return pets.reduce(
    (acc, pet) => {
      if (pet.status === "PENDING") acc.pending += 1;
      if (pet.status === "ADOPTED") acc.adopted += 1;
      if (pet.status === "FOSTERED") acc.fostered += 1;
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

  const listQuery = usePets({ page, size });
  const createPetMutation = useCreatePetByShelter();
  const organizationsQuery = useOrganizations({
    page: 0,
    size: 100,
    status: ["ACTIVE"],
  });

  const data = listQuery.data;
  const pets = React.useMemo(() => data?.content ?? [], [data?.content]);
  const kpis = React.useMemo(
    () => getKpis(pets, data?.totalElements ?? 0),
    [data?.totalElements, pets],
  );

  const handleCreatePet = React.useCallback(
    async (payload: Partial<PetCreatePayload>) => {
      try {
        await createPetMutation.mutateAsync(payload);
        setCreateOpen(false);
        toast.success("Tạo thú cưng thành công");
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
    [createPetMutation],
  );

  return (
    <div className="space-y-6">
      <TitlePerPage
        title="Quản lý thú cưng"
        description="Quản trị toàn bộ dữ liệu thú cưng trong hệ thống"
        buttonText="Thêm thú cưng"
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
        organizations={organizationsQuery.data?.content ?? []}
        onSubmit={handleCreatePet}
      />
    </div>
  );
}
