"use client";

import { PetListTable } from "@/components/pet/PetListTable";
import petService from "@/services/pet";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function PetManagementPage() {
  const queryParams = useSearchParams();
  const { data, isPending, isError } = useQuery({
    queryKey: ["pets", queryParams],
    queryFn: () => petService.getAllPets(queryParams),
  });
  console.log(data);

  return (
    <div>
      {data && data.data.data?.content && (
        <PetListTable data={data.data.data?.content} />
      )}
    </div>
  );
}
