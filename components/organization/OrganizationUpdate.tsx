"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { Organization } from "@/types/organization.type";

export type OrganizationTypeValue = "SHELTER" | "VET_CENTER";

export interface OrganizationUpdateValues {
  name: string;
  type: OrganizationTypeValue;
  description: string;
  email: string;
  phone: string;
  officialLink: string;
  streetAddress: string;
  wardName: string;
  provinceName: string;
  latitude: string;
  longitude: string;
  status?: string;
}

export interface OrganizationUpdateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitting?: boolean;
  organization?: Organization | null;
  onSubmit?: (values: OrganizationUpdateValues) => void;
}

function toStr(v: unknown) {
  if (v === undefined || v === null) return "";
  return String(v);
}

function getDefaultValues(): OrganizationUpdateValues {
  return {
    name: "",
    type: "SHELTER",
    description: "",
    email: "",
    phone: "",
    officialLink: "",
    streetAddress: "",
    wardName: "",
    provinceName: "",
    latitude: "",
    longitude: "",
    status: undefined,
  };
}

function mapOrganizationToValues(
  org: Organization | null | undefined,
): OrganizationUpdateValues {
  const d = getDefaultValues();
  if (!org) return d;

  return {
    name: org.name ?? d.name,
    type: (org.type as OrganizationTypeValue) ?? d.type,
    description: org.description ?? d.description,
    email: org.email ?? d.email,
    phone: org.phone ?? d.phone,
    officialLink: org.officialLink ?? d.officialLink,
    streetAddress: org.streetAddress ?? d.streetAddress,
    wardName: org.wardName ?? d.wardName,
    provinceName: org.provinceName ?? d.provinceName,
    latitude: toStr((org as unknown as { latitude?: number }).latitude),
    longitude: toStr((org as unknown as { longitude?: number }).longitude),
    status: (org as unknown as { status?: string }).status,
  };
}

export function OrganizationUpdate({
  open,
  onOpenChange,
  submitting,
  organization,
  onSubmit,
}: OrganizationUpdateProps) {
  const [values, setValues] = React.useState<OrganizationUpdateValues>(() =>
    mapOrganizationToValues(organization),
  );

  React.useEffect(() => {
    if (!open) return;
    setValues(mapOrganizationToValues(organization));
  }, [open, organization]);

  const disabled = Boolean(submitting) || !organization;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-4xl p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Cập nhật trung tâm</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin trung tâm và lưu thay đổi.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
          <Separator className="my-4" />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Tên trung tâm</Label>
              <Input
                placeholder="Happy Paws Shelter"
                value={values.name}
                onChange={(e) =>
                  setValues((p) => ({ ...p, name: e.target.value }))
                }
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label>Loại</Label>
              <Select
                value={values.type}
                onValueChange={(v) =>
                  setValues((p) => ({ ...p, type: v as OrganizationTypeValue }))
                }
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SHELTER">SHELTER</SelectItem>
                  <SelectItem value="VET_CENTER">VET_CENTER</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Mô tả</Label>
              <textarea
                placeholder="Mô tả ngắn về trung tâm..."
                value={values.description}
                onChange={(e) =>
                  setValues((p) => ({ ...p, description: e.target.value }))
                }
                className="min-h-24 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={disabled}
              />
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                placeholder="contact@shelter.vn"
                type="email"
                value={values.email}
                onChange={(e) =>
                  setValues((p) => ({ ...p, email: e.target.value }))
                }
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label>Điện thoại</Label>
              <Input
                placeholder="+84-28-1234-5678"
                value={values.phone}
                onChange={(e) =>
                  setValues((p) => ({ ...p, phone: e.target.value }))
                }
                disabled={disabled}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Official link</Label>
              <Input
                placeholder="https://facebook.com/happypaws"
                value={values.officialLink}
                onChange={(e) =>
                  setValues((p) => ({ ...p, officialLink: e.target.value }))
                }
                disabled={disabled}
              />
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Địa chỉ</Label>
              <Input
                placeholder="123"
                value={values.streetAddress}
                onChange={(e) =>
                  setValues((p) => ({ ...p, streetAddress: e.target.value }))
                }
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label>Phường / Xã</Label>
              <Input
                placeholder="Phuong 1"
                value={values.wardName}
                onChange={(e) =>
                  setValues((p) => ({ ...p, wardName: e.target.value }))
                }
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label>Tỉnh / Thành phố</Label>
              <Input
                placeholder="Ho Chi Minh"
                value={values.provinceName}
                onChange={(e) =>
                  setValues((p) => ({ ...p, provinceName: e.target.value }))
                }
                disabled={disabled}
              />
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Latitude</Label>
              <Input
                placeholder="10.762622"
                value={values.latitude}
                onChange={(e) =>
                  setValues((p) => ({ ...p, latitude: e.target.value }))
                }
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label>Longitude</Label>
              <Input
                placeholder="106.660172"
                value={values.longitude}
                onChange={(e) =>
                  setValues((p) => ({ ...p, longitude: e.target.value }))
                }
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6">
          <Button
            variant="secondary"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={Boolean(submitting)}
          >
            Huỷ
          </Button>
          <Button
            type="button"
            onClick={() => onSubmit?.(values)}
            disabled={disabled}
          >
            {submitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
