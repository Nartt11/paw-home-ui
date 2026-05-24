"use client";

import * as React from "react";
import dynamic from "next/dynamic";

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

const LocationPickerMap = dynamic(
  () => import("@/components/map/LocationPickerMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 w-full items-center justify-center rounded-lg border bg-muted/30 text-sm text-muted-foreground">
        Đang tải bản đồ...
      </div>
    ),
  },
);

export type OrganizationTypeValue = "SHELTER" | "VET_CENTER";

export interface OrganizationCreateNewValues {
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
}

export interface OrganizationCreateNewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitting?: boolean;
  onSubmit?: (values: OrganizationCreateNewValues) => void;
}

const DEFAULT_VALUES: OrganizationCreateNewValues = {
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
};

export function OrganizationCreateNew({
  open,
  onOpenChange,
  submitting,
  onSubmit,
}: OrganizationCreateNewProps) {
  const [values, setValues] =
    React.useState<OrganizationCreateNewValues>(DEFAULT_VALUES);
  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setValues(DEFAULT_VALUES);
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full sm:max-w-4xl p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Tạo mới trung tâm</DialogTitle>
          <DialogDescription>
            Nhập thông tin cơ bản của mái ấm / cơ sở cứu hộ.
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
              />
            </div>

            <div className="space-y-2">
              <Label>Loại</Label>
              <Select
                value={values.type}
                onValueChange={(v) =>
                  setValues((p) => ({ ...p, type: v as OrganizationTypeValue }))
                }
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
                className="min-h-24 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              />
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Chọn vị trí trên bản đồ</Label>
              <div className="overflow-hidden rounded-lg border">
                <LocationPickerMap
                  latitude={
                    values.latitude.trim() ? Number(values.latitude) : undefined
                  }
                  longitude={
                    values.longitude.trim() ? Number(values.longitude) : undefined
                  }
                  disabled={Boolean(submitting)}
                  onChange={({ latitude, longitude }) =>
                    setValues((p) => ({
                      ...p,
                      latitude: String(latitude),
                      longitude: String(longitude),
                    }))
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Nhấn lên bản đồ hoặc kéo marker để chọn tọa độ.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Latitude</Label>
              <Input
                value={values.latitude}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label>Longitude</Label>
              <Input
                value={values.longitude}
                readOnly
              />
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6">
          <Button
            variant="secondary"
            type="button"
            onClick={() => handleOpenChange(false)}
            disabled={Boolean(submitting)}
          >
            Huỷ
          </Button>
          <Button
            type="button"
            onClick={() => onSubmit?.(values)}
            disabled={Boolean(submitting)}
          >
            {submitting ? "Đang tạo..." : "Tạo mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
