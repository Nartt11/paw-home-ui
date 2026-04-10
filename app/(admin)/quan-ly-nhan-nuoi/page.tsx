"use client";

import { AdoptionListTable } from "@/components/adoption/AdoptionListTable";
import adoptionService from "@/services/adoption";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function CenterManagementPage() {
  const queryParams = useSearchParams();
  const { data, isPending, isError } = useQuery({
    queryKey: ["pets", queryParams],
    queryFn: () => adoptionService.getAllAdoptions(queryParams),
  });
  console.log(data);

  return (
    <div>
      {data && data.data.data?.content && (
        <AdoptionListTable data={data.data.data?.content} />
      )}
    </div>
  );
}
