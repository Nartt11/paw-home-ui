"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowRightIcon,
  Building2Icon,
  ExternalLinkIcon,
  HeartHandshakeIcon,
  HomeIcon,
  LifeBuoyIcon,
  MailIcon,
  MapPinIcon,
  NavigationIcon,
  PawPrintIcon,
  PhoneIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_ROUTES } from "@/constants/routes";
import { useOrganizationOverview } from "@/hooks/use-organization";
import { formatDateTime } from "@/lib/datetime";
import {
  organizationStatusBadge,
  organizationStatusLabel,
  organizationTypeLabel,
} from "@/lib/organization-display";
import { STATUS_TONE_SOFT, type StatusTone } from "@/lib/status-tone";
import { cn } from "@/lib/utils";
import type { Organization, OrganizationOverview } from "@/types/organization.type";

const LocationPickerMap = dynamic(() => import("@/components/map/LocationPickerMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

function hasValidCoordinates(latitude: unknown, longitude: unknown) {
  return typeof latitude === "number" && Number.isFinite(latitude) && typeof longitude === "number" && Number.isFinite(longitude);
}

/** A public figure: big number, short label. */
function Figure({ value, label, icon: Icon }: { value?: number; label: string; icon: typeof PawPrintIcon }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">
        {value == null ? <Skeleton className="h-7 w-10" /> : value.toLocaleString("vi-VN")}
      </div>
    </div>
  );
}

/** One piece of work waiting at the centre; links to where it is done, coloured only when there is some. */
function WorkItem({ value, label, href, tone }: { value: number; label: string; href: string; tone: StatusTone }) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors hover:bg-muted/50",
        value > 0 && STATUS_TONE_SOFT[tone],
      )}
    >
      <span>{label}</span>
      <span className="flex items-center gap-1.5 font-semibold tabular-nums">
        {value.toLocaleString("vi-VN")}
        <ArrowRightIcon className="size-3.5 opacity-50 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

function Operations({ operations }: { operations: NonNullable<OrganizationOverview["operations"]> }) {
  return (
    <section className="space-y-3" aria-labelledby="org-work">
      <h3 id="org-work" className="text-sm font-semibold">Việc đang có</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        <WorkItem value={operations.pendingAdoptions} label="Đơn nhận nuôi chờ duyệt" href={APP_ROUTES.ADOPTION_MANAGEMENT} tone="warning" />
        <WorkItem value={operations.awaitingPickup} label="Đơn đã duyệt, chờ đón" href={APP_ROUTES.ADOPTION_MANAGEMENT} tone="info" />
        <WorkItem value={operations.activeRescueClaims} label="Ca cứu hộ đang nhận" href={APP_ROUTES.RESCUE_CASE_MANAGEMENT} tone="info" />
        <WorkItem value={operations.petsUnderTreatment} label="Bé đang điều trị" href={APP_ROUTES.PET_MANAGEMENT} tone="warning" />
        <WorkItem value={operations.openFollowupAlerts} label="Việc sau nhận nuôi chưa xong" href={APP_ROUTES.FOLLOWUP_ALERTS} tone="serious" />
        <WorkItem value={operations.activeMembers} label="Thành viên" href={APP_ROUTES.ORGANIZATION_MEMBER_MANAGEMENT} tone="neutral" />
      </div>
    </section>
  );
}

function ContactRow({ icon: Icon, children }: { icon: typeof PhoneIcon; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <div className="min-w-0 break-words">{children}</div>
    </div>
  );
}

export interface OrganizationViewDetailProps {
  organization: Organization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * One centre, for the people choosing it and the people running it. Everyone sees the photo, what the
 * centre does, how many pets wait for a home and how to reach it; admins and the centre's members also
 * see the work waiting there, each item linking to where it is done.
 */
export function OrganizationViewDetail({ organization, open, onOpenChange }: OrganizationViewDetailProps) {
  const overviewQuery = useOrganizationOverview(open ? organization.organizationId : undefined);
  const overview = overviewQuery.data;
  const operations = overview?.operations ?? null;

  const canShowMap = hasValidCoordinates(organization.latitude, organization.longitude);
  const address = [organization.streetAddress, organization.wardName, organization.provinceName].filter(Boolean).join(", ");
  const directions = canShowMap
    ? `https://www.google.com/maps/dir/?api=1&destination=${organization.latitude},${organization.longitude}`
    : address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : null;
  const petsLink = `${APP_ROUTES.ADOPTION}?organizationId=${organization.organizationId}&orgName=${encodeURIComponent(organization.name ?? "")}`;
  const isActive = (organization.status ?? "").toUpperCase() === "ACTIVE";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* The photo comes first: it is what people recognise a centre by. */}
          <div className="relative aspect-[16/7] w-full bg-muted">
            {organization.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={organization.imageUrl} alt={`Ảnh của ${organization.name}`} className="size-full object-cover" />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <Building2Icon className="size-10" aria-hidden />
                <span className="text-sm">Trung tâm chưa có ảnh</span>
              </div>
            )}
          </div>

          <DialogHeader className="space-y-2 px-6 pt-5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{organizationTypeLabel(organization.type)}</Badge>
              <Badge variant="outline" className={organizationStatusBadge(organization.status)}>
                {organizationStatusLabel(organization.status)}
              </Badge>
              {operations?.organizationCode ? (
                <span className="text-xs tabular-nums text-muted-foreground">{operations.organizationCode}</span>
              ) : null}
            </div>
            <DialogTitle className="text-xl">{organization.name || "Trung tâm"}</DialogTitle>
            <DialogDescription className="whitespace-pre-line text-sm leading-relaxed">
              {organization.description?.trim() || "Trung tâm chưa giới thiệu về mình."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 px-6 py-5">
            <section aria-label="Con số của trung tâm" className="space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Figure value={overview?.availablePets} label="Đang chờ nhà" icon={HomeIcon} />
                <Figure value={overview?.petsInCare} label="Đang chăm sóc" icon={PawPrintIcon} />
                <Figure value={overview?.adoptedPets} label="Đã có nhà" icon={HeartHandshakeIcon} />
                <Figure value={overview?.rescuedCases} label="Ca đã cứu" icon={LifeBuoyIcon} />
              </div>
              {isActive && (overview?.availablePets ?? 0) > 0 ? (
                <Button asChild className="w-full sm:w-auto">
                  <Link href={petsLink}>
                    Xem {overview?.availablePets} bé đang chờ nhà
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </Button>
              ) : null}
            </section>

            {operations ? <Operations operations={operations} /> : null}

            <Separator />

            <section className="grid gap-5 md:grid-cols-[1fr_260px]" aria-labelledby="org-contact">
              <div className="space-y-3">
                <h3 id="org-contact" className="text-sm font-semibold">Liên hệ</h3>
                {organization.phone ? (
                  <ContactRow icon={PhoneIcon}>
                    <a href={`tel:${organization.phone}`} className="text-primary underline-offset-4 hover:underline">
                      {organization.phone}
                    </a>
                  </ContactRow>
                ) : null}
                {organization.email ? (
                  <ContactRow icon={MailIcon}>
                    <a href={`mailto:${organization.email}`} className="text-primary underline-offset-4 hover:underline">
                      {organization.email}
                    </a>
                  </ContactRow>
                ) : null}
                {address ? <ContactRow icon={MapPinIcon}>{address}</ContactRow> : null}
                {organization.officialLink ? (
                  <ContactRow icon={ExternalLinkIcon}>
                    <a href={organization.officialLink} target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
                      Trang chính thức
                    </a>
                  </ContactRow>
                ) : null}
                {directions ? (
                  <Button asChild variant="outline" size="sm">
                    <a href={directions} target="_blank" rel="noreferrer">
                      <NavigationIcon className="size-4" />
                      Chỉ đường
                    </a>
                  </Button>
                ) : null}
              </div>

              <div className="h-44 overflow-hidden rounded-lg border bg-muted">
                {canShowMap ? (
                  <LocationPickerMap latitude={organization.latitude} longitude={organization.longitude} disabled />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Chưa có vị trí trên bản đồ</div>
                )}
              </div>
            </section>

            {operations ? (
              <p className="text-xs text-muted-foreground">
                {operations.requestedByName ? `Đăng ký bởi ${operations.requestedByName}` : "Tạo bởi quản trị viên"}
                {operations.createdAt ? ` · ${formatDateTime(operations.createdAt)}` : ""}
              </p>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
