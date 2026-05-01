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

import type { CreateRescueCasePayloadDto } from "@/services/rescue-case/rescue-case-dto";
import type { RescueCasePriority } from "@/types/rescue-case.type";

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

  React.useEffect(() => {
    if (!open) setValues(DEFAULT_VALUES);
  }, [open]);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
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

            <div className="space-y-2">
              <Label>Latitude</Label>
              <Input
                type="number"
                step="0.000001"
                value={String(values.latitude)}
                onChange={(e) =>
                  update("latitude", Number(e.target.value) || 0)
                }
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2">
              <Label>Longitude</Label>
              <Input
                type="number"
                step="0.000001"
                value={String(values.longitude)}
                onChange={(e) =>
                  update("longitude", Number(e.target.value) || 0)
                }
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
            onClick={() => onOpenChange(false)}
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
