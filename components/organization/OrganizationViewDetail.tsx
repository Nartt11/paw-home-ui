"use client";

import * as React from "react";

import type { Organization } from "@/types/organization.type,.ts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function FieldRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="grid gap-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className={mono ? "font-mono text-sm" : "text-sm"}>{value}</div>
    </div>
  );
}

export interface OrganizationViewDetailProps {
  organization: Organization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrganizationViewDetail({
  organization,
  open,
  onOpenChange,
}: OrganizationViewDetailProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-4xl p-0">
        <DialogHeader className="px-6 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <DialogTitle className="text-base sm:text-lg">
              {organization.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{organization.type}</Badge>
              <Badge>{organization.status}</Badge>
            </div>
          </div>
          {organization.description ? (
            <DialogDescription className="mt-1">
              {organization.description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-6 pb-6">
          <Card className="rounded-3xl border-0 shadow-none">
            <CardHeader className="hidden" />
            <CardContent className="space-y-6 p-0">
              <Separator />

              <div className="grid gap-5 md:grid-cols-2">
                <FieldRow
                  label="Organization ID"
                  value={organization.organizationId}
                  mono
                />
                <FieldRow
                  label="Created by"
                  value={organization.createdBy}
                  mono
                />
                <FieldRow label="Email" value={organization.email || "—"} />
                <FieldRow label="Phone" value={organization.phone || "—"} />
                <FieldRow
                  label="Official link"
                  value={organization.officialLink || "—"}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <FieldRow
                  label="Street address"
                  value={organization.streetAddress || "—"}
                />
                <FieldRow label="Ward" value={organization.wardName || "—"} />
                <FieldRow
                  label="Province"
                  value={organization.provinceName || "—"}
                />
                <FieldRow
                  label="Coordinates"
                  value={`${organization.latitude}, ${organization.longitude}`}
                  mono
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  Map
                </div>
                <div className="overflow-hidden rounded-2xl border border-border">
                  <MapContainer
                    center={[organization.latitude, organization.longitude]}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="h-64 w-full"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker
                      position={[organization.latitude, organization.longitude]}
                    >
                      <Popup>{organization.name}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
