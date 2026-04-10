"use client";
import { OrganizationListTable } from "@/components/organization/OrganizationListTable";
import organizationService from "@/services/organization";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function CenterManagementPage() {
  const queryParams = useSearchParams();
  const { data, isPending, isError } = useQuery({
    queryKey: ["pets", queryParams],
    queryFn: () => organizationService.getAllOrganizations(queryParams),
  });
  console.log(data);

  return (
    <div>
      {data && data.data.data?.content && (
        <OrganizationListTable data={data.data.data?.content} />
      )}
    </div>
  );
}
