import { redirect } from "next/navigation";

import { APP_ROUTES } from "@/constants/routes";

/** Old address of the post management page; kept so existing links still land somewhere. */
export default function LegacyPostManagementPage() {
  redirect(APP_ROUTES.POST_MANAGEMENT);
}
