"use client";

import * as React from "react";

import { AdoptionListTable } from "@/components/adoption/AdoptionListTable";
import AdoptionRequestList from "@/components/adoption/AdoptionRequestList";
import { AdoptionViewDetail } from "@/components/adoption/AdoptionViewDetail";
import TitlePerPage from "@/components/common/admin/TitlePerPage";
import adoptionService from "@/services/adoption/adoption";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function CenterManagementPage() {
  const queryParams = useSearchParams();

  const { data } = useQuery({
    queryKey: ["adoptions", queryParams],
    queryFn: () => adoptionService.getAllAdoptions(queryParams),
  });

  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const { data: adoptionDetail, isFetching: detailLoading } = useQuery({
    queryKey: ["adoption", selectedId],
    queryFn: () => adoptionService.getAdoptionCaseById(selectedId as string),
    enabled: Boolean(selectedId) && openDetail,
  });

  const handleViewDetail = React.useCallback((applicationId: string) => {
    setSelectedId(applicationId);
    setOpenDetail(true);
  }, []);

  return (
    <div className="space-y-6">
      <TitlePerPage
        title="Quản lý nhận nuôi"
        description="Danh sách đơn xin nhận nuôi"
        buttonText="Thêm đơn xin nhận nuôi"
      />

      <h3 className="text-h2">Danh sách chờ duyệt</h3>
      <AdoptionRequestList
        adoptionsList={data?.content ?? []}
        onViewDetail={handleViewDetail}
      />

      <AdoptionListTable
        data={data?.content ?? []}
        onViewDetail={handleViewDetail}
      />

      <AdoptionViewDetail
        open={openDetail}
        onOpenChange={(v) => {
          setOpenDetail(v);
          if (!v) setSelectedId(null);
        }}
        adoption={detailLoading ? null : (adoptionDetail ?? null)}
      />
    </div>
  );
}
