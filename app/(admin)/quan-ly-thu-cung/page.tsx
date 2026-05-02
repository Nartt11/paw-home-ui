"use client";

import * as React from "react";

import TitlePerPage from "@/components/common/admin/TitlePerPage";
import KPICardPet from "@/components/pet/KPICardPet";
import { PetListTable } from "@/components/pet/PetListTable";
import { PetCreateNew } from "@/components/pet/PetCreateNew";
import type { CreateNewPetValues } from "@/components/pet/PetCreateNew";

import petService from "@/services/pet/pet";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  Heart,
  PawPrint,
  ShieldAlert,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function PetManagementPage() {
  const queryParams = useSearchParams();
  const queryClient = useQueryClient();

  const [createOpen, setCreateOpen] = React.useState(false);

  const listQuery = useQuery({
    queryKey: ["pets", queryParams],
    queryFn: () => petService.getAllPets(queryParams),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateNewPetValues) => petService.createPet(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pets"] });
      setCreateOpen(false);
    },
  });

  const data = listQuery.data;

  return (
    <div className="@container/main flex flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6">
      {/* Top Header */}
      <TitlePerPage
        title="Quản lý thú cưng"
        description="Quản trị toàn bộ dữ liệu thú cưng trong hệ thống"
        buttonText="Thêm thú cưng"
        handleOpenModal={() => setCreateOpen(true)}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <KPICardPet
          title="Tổng số thú cưng"
          value={15}
          icon={PawPrint}
          color="text-blue-600 bg-blue-50"
        />
        <KPICardPet
          title="Chờ nhận nuôi"
          value={15}
          icon={Heart}
          color="text-primary bg-primary/5"
        />
        <KPICardPet
          title="Đã có chủ"
          value={15}
          icon={CheckCircle2}
          color="text-green-600 bg-green-50"
        />
        <KPICardPet
          title="Đang cứu trợ"
          value={15}
          icon={ShieldAlert}
          color="text-amber-600 bg-amber-50"
        />
        <KPICardPet
          title="Cảnh báo sức khỏe"
          value={15}
          icon={AlertTriangle}
          color="text-red-600 bg-red-50"
        />
      </div>

      {data && data.content && <PetListTable data={data.content} />}

      <PetCreateNew
        open={createOpen}
        onOpenChange={setCreateOpen}
        submitting={createMutation.isPending}
        onSubmit={(values: CreateNewPetValues) => createMutation.mutate(values)}
      />
    </div>
  );
}
