import type { Metadata } from "next";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import data from "./data.json";
import RequireAuth from "@/components/auth/RequireAuth";
import { SYSTEM_ROLES, ORGANIZATION_ROLES } from "@/constants/roles";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Báo cáo thống kê, biểu đồ hoạt động cứu trợ, nhận nuôi và quyên góp trên hệ thống Paw Home.",
};

export default function Page() {
  return (
    <RequireAuth
      allowedSystemRoles={[SYSTEM_ROLES.ADMIN]}
      allowedOrganizationRoles={[
        ORGANIZATION_ROLES.OWNER,
        ORGANIZATION_ROLES.STAFF,
        ORGANIZATION_ROLES.MEMBER,
      ]}
    >
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
