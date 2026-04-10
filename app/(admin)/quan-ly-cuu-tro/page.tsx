"use client";

import { RescueCaseListTable } from "@/components/rescue-case/RescueCaseListTable";
import rescueService from "@/services/rescue";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function CenterManagementPage() {
  const queryParams = useSearchParams();
  const { data, isPending, isError } = useQuery({
    queryKey: ["pets", queryParams],
    queryFn: () => rescueService.getAllRescueCases(queryParams),
  });
  console.log(data);

  return (
    <div>
      {data && data.data.data?.content && (
        <RescueCaseListTable data={data.data.data?.content} />
      )}
    </div>
  );
}
