"use client";

import * as React from "react";

import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { RescueCaseListTable } from "@/components/rescue-case/RescueCaseListTable";
import { RescueCaseCreate } from "@/components/rescue-case/RescueCaseCreate";
import type { RescueCaseCreateValues } from "@/components/rescue-case/RescueCaseCreate";
import { RescueCaseViewDetail } from "@/components/rescue-case/RescueCaseViewDetail";

import rescueService from "@/services/rescue-case/rescue-case";
import type { RescueCase } from "@/types/rescue-case.type";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

function toNumber(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function setQueryParams(
  router: ReturnType<typeof useRouter>,
  queryParams: ReturnType<typeof useSearchParams>,
  patch: Record<string, string | number | undefined | null>,
) {
  const next = new URLSearchParams(queryParams.toString());
  Object.entries(patch).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") next.delete(k);
    else next.set(k, String(v));
  });
  router.replace(`?${next.toString()}`);
}

export default function CenterManagementPage() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = toNumber(queryParams.get("page"), 1);
  const size = toNumber(queryParams.get("size"), 10);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const listQuery = useQuery({
    queryKey: ["rescue-cases", page, size],
    queryFn: () => rescueService.getAllRescueCases({ page, size }),
  });

  const detailQuery = useQuery({
    queryKey: ["rescue-case", selectedId],
    queryFn: () => rescueService.getRescueCaseById(selectedId as string),
    enabled: Boolean(selectedId) && viewOpen,
  });

  const selectedCase: RescueCase | null = detailQuery.data ?? null;

  const createMutation = useMutation({
    mutationFn: (payload: RescueCaseCreateValues) =>
      rescueService.createRescueCase(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["rescue-cases"] });
      setCreateOpen(false);
    },
  });

  const data = listQuery.data;

  return (
    <div className="space-y-6">
      <TitlePerPage
        title="Quản lý ca cứu hộ"
        description="Xem danh sách các ca cứu hộ đã được báo cáo, quản lý thông tin và trạng thái của từng ca cứu hộ."
        buttonText="Báo cáo ca cứu hộ mới"
        handleOpenModal={() => setCreateOpen(true)}
      />

      <RescueCaseListTable
        data={data?.content ?? []}
        loading={listQuery.isPending}
        page={data?.page ?? page}
        size={data?.size ?? size}
        totalPages={data?.totalPages ?? 1}
        totalElements={data?.totalElements ?? 0}
        onPageChange={(nextPage) =>
          setQueryParams(router, queryParams, { page: nextPage })
        }
        onSizeChange={(nextSize) =>
          setQueryParams(router, queryParams, { page: 1, size: nextSize })
        }
      />

      <RescueCaseCreate
        open={createOpen}
        onOpenChange={setCreateOpen}
        submitting={createMutation.isPending}
        onSubmit={(values) => createMutation.mutate(values)}
      />

      <RescueCaseViewDetail
        open={viewOpen}
        onOpenChange={(v) => {
          setViewOpen(v);
          if (!v) setSelectedId(null);
        }}
        rescueCase={selectedCase}
      />
    </div>
  );
}
