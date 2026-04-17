"use client";

import TitlePerPage from "@/components/common/admin/TitlePerPage";
import KPICardPet from "@/components/pet/KPICardPet";
import { PetListTable } from "@/components/pet/PetListTable";
import petService from "@/services/pet";
import { useQuery } from "@tanstack/react-query";
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
  const { data, isPending, isError } = useQuery({
    queryKey: ["pets", queryParams],
    queryFn: () => petService.getAllPets(queryParams),
  });
  console.log(data);

  const handleOpenModal = () => {
    alert("Chức năng này đang được phát triển. Vui lòng quay lại sau!");
  };

  return (
    <div className="@container/main flex flex-col gap-4 py-4 px-4 md:px-6 md:gap-6 md:py-6">
      {/* Top Header */}
      <TitlePerPage
        title="Quản lý thú cưng"
        description="Quản trị toàn bộ dữ liệu thú cưng trong hệ thống"
        handleOpenModal={handleOpenModal}
      />
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
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
      {data && data.data.data?.content && (
        <PetListTable data={data.data.data?.content} />
      )}
    </div>
  );
}
