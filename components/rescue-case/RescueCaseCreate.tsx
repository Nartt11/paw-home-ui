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

import type { CreateRescueCasePayloadDto } from "@/services/rescue-case/rescue-case-dto";
import type { RescueCasePriority } from "@/types/rescue-case.type";

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

export type RescueCaseCreateValues = CreateRescueCasePayloadDto;

export interface RescueCaseCreateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitting?: boolean;
  onSubmit?: (values: RescueCaseCreateValues) => void;
}

const PRIORITIES: Array<{ value: RescueCasePriority; label: string }> = [
  { value: "LOW", label: "Thấp" },
  { value: "NORMAL", label: "Bình thường" },
  { value: "HIGH", label: "Cao" },
  { value: "CRITICAL", label: "Khẩn cấp" },
];

const DEFAULT_VALUES: RescueCaseCreateValues = {
  petId: "",
  organizationId: "",
  species: "",
  color: "",
  size: "",
  priority: "NORMAL",
  description: "",
  latitude: 0,
  longitude: 0,
  locationText: "",
  provinceCode: "",
  provinceName: "",
  wardCode: "",
  wardName: "",
};

export function RescueCaseCreate({
  open,
  onOpenChange,
  submitting,
  onSubmit,
}: RescueCaseCreateProps) {
  const [values, setValues] =
    React.useState<RescueCaseCreateValues>(DEFAULT_VALUES);
  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setValues(DEFAULT_VALUES);
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  const update = React.useCallback(
    <K extends keyof RescueCaseCreateValues>(
      key: K,
      value: RescueCaseCreateValues[K],
    ) => {
      setValues((p) => ({ ...p, [key]: value }));
    },
    [],
  );

  const canSubmit = React.useMemo(() => {
    return (
      Boolean(values.organizationId.trim()) &&
      Boolean(values.species.trim()) &&
      Boolean(values.locationText.trim()) &&
      Boolean(values.description.trim())
    );
  }, [
    values.description,
    values.locationText,
    values.organizationId,
    values.species,
  ]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Báo cáo ca cứu hộ mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin ca cứu hộ. Các trường tối thiểu: <b>Tổ chức</b>,{" "}
            <b>Loài</b>, <b>Địa điểm</b>, <b>Mô tả</b>.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
          <Separator className="my-4" />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Organization ID</Label>
              <Input
                placeholder="org_123"
                value={values.organizationId}
                onChange={(e) => update("organizationId", e.target.value)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2">
              <Label>Pet ID (tuỳ chọn)</Label>
              <Input
                placeholder="pet_123"
                value={values.petId}
                onChange={(e) => update("petId", e.target.value)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2">
              <Label>Loài</Label>
              <Input
                placeholder="Chó / Mèo..."
                value={values.species}
                onChange={(e) => update("species", e.target.value)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2">
              <Label>Mức độ ưu tiên</Label>
              <Select
                value={values.priority}
                onValueChange={(v) =>
                  update("priority", v as RescueCasePriority)
                }
                disabled={Boolean(submitting)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức độ" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Màu sắc</Label>
              <Input
                placeholder="Vàng / Đen..."
                value={values.color}
                onChange={(e) => update("color", e.target.value)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2">
              <Label>Kích thước</Label>
              <Input
                placeholder="Nhỏ / Vừa / Lớn"
                value={values.size}
                onChange={(e) => update("size", e.target.value)}
                disabled={Boolean(submitting)}
              />
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Địa điểm</Label>
              <Input
                placeholder="Ví dụ: 12 Nguyễn Trãi, Q.1"
                value={values.locationText}
                onChange={(e) => update("locationText", e.target.value)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Chọn vị trí trên bản đồ</Label>
              <div className="overflow-hidden rounded-lg border">
                <LocationPickerMap
                  latitude={values.latitude || undefined}
                  longitude={values.longitude || undefined}
                  disabled={Boolean(submitting)}
                  onChange={({ latitude, longitude }) => {
                    update("latitude", latitude);
                    update("longitude", longitude);
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Nhấn lên bản đồ hoặc kéo marker để chọn tọa độ.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Latitude</Label>
              <Input
                value={String(values.latitude)}
                readOnly
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2">
              <Label>Longitude</Label>
              <Input
                value={String(values.longitude)}
                readOnly
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2">
              <Label>Province</Label>
              <Input
                placeholder="Hồ Chí Minh"
                value={values.provinceName}
                onChange={(e) => update("provinceName", e.target.value)}
                disabled={Boolean(submitting)}
              />
              <p className="text-xs text-muted-foreground">
                Có thể bổ sung select tỉnh/huyện sau.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Province code</Label>
              <Input
                placeholder="79"
                value={values.provinceCode}
                onChange={(e) => update("provinceCode", e.target.value)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2">
              <Label>Ward</Label>
              <Input
                placeholder="Phường 1"
                value={values.wardName}
                onChange={(e) => update("wardName", e.target.value)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2">
              <Label>Ward code</Label>
              <Input
                placeholder="00001"
                value={values.wardCode}
                onChange={(e) => update("wardCode", e.target.value)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Mô tả</Label>
              <textarea
                placeholder="Mô tả tình trạng, dấu hiệu nhận biết..."
                value={values.description}
                onChange={(e) => update("description", e.target.value)}
                className="min-h-28 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={Boolean(submitting)}
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
            disabled={Boolean(submitting) || !canSubmit}
          >
            {submitting ? "Đang tạo..." : "Tạo ca cứu hộ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
