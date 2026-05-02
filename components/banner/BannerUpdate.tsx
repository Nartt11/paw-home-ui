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
import { Checkbox } from "@/components/ui/checkbox";

import type { UpdateBannerPayloadDto } from "@/services/banner/banner-dto";
import type { Banner } from "@/types/banner.type";

export type BannerUpdateValues = UpdateBannerPayloadDto;

export interface BannerUpdateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitting?: boolean;
  banner?: Banner | null;
  onSubmit?: (values: BannerUpdateValues) => void;
}

const LINK_TYPES: Array<{ value: string; label: string }> = [
  { value: "EXTERNAL", label: "External" },
  { value: "INTERNAL", label: "Internal" },
];

const TARGET_PAGES: Array<{ value: string; label: string }> = [
  { value: "HOME", label: "Trang chủ" },
  { value: "ADOPTION", label: "Nhận nuôi" },
  { value: "RESCUE", label: "Cứu hộ" },
  { value: "DONATE", label: "Ủng hộ" },
];

function mapBannerToValues(
  banner: Banner | null | undefined,
): BannerUpdateValues {
  if (!banner) return {};

  return {
    title: banner.title ?? "",
    subtitle: banner.subtitle ?? "",
    mediaId: banner.mediaId ?? "",
    linkUrl: banner.linkUrl ?? "",
    linkType: banner.linkType ?? "EXTERNAL",
    displayOrder:
      typeof banner.displayOrder === "number" ? banner.displayOrder : 1,
    startDate: banner.startDate ?? "",
    endDate: banner.endDate ?? "",
    active: Boolean(banner.active),
    targetPage: banner.targetPage ?? "HOME",
  };
}

export function BannerUpdate({
  open,
  onOpenChange,
  submitting,
  banner,
  onSubmit,
}: BannerUpdateProps) {
  const [values, setValues] = React.useState<BannerUpdateValues>(() =>
    mapBannerToValues(banner),
  );

  React.useEffect(() => {
    if (!open) return;
    setValues(mapBannerToValues(banner));
  }, [open, banner]);

  const disabled = Boolean(submitting) || !banner;

  const update = React.useCallback(
    <K extends keyof BannerUpdateValues>(
      key: K,
      value: BannerUpdateValues[K],
    ) => {
      setValues((p) => ({ ...p, [key]: value }));
    },
    [],
  );

  const canSubmit = React.useMemo(() => {
    // Update API supports partial, but UI requires minimal safety.
    return Boolean(values.title?.trim()) && Boolean(values.mediaId?.trim());
  }, [values.mediaId, values.title]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Cập nhật banner</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin banner và lưu thay đổi.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
          <Separator className="my-4" />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Tiêu đề</Label>
              <Input
                placeholder="Banner khuyến mãi tháng 5"
                value={values.title ?? ""}
                onChange={(e) => update("title", e.target.value)}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Phụ đề</Label>
              <Input
                placeholder="Mô tả ngắn..."
                value={values.subtitle ?? ""}
                onChange={(e) => update("subtitle", e.target.value)}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label>Target page</Label>
              <Select
                value={values.targetPage ?? ""}
                onValueChange={(v) => update("targetPage", v)}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trang" />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_PAGES.map((it) => (
                    <SelectItem key={it.value} value={it.value}>
                      {it.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Thứ tự hiển thị</Label>
              <Input
                type="number"
                min={1}
                value={values.displayOrder ?? 1}
                onChange={(e) =>
                  update("displayOrder", Number(e.target.value) || 1)
                }
                disabled={disabled}
              />
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Media ID</Label>
              <Input
                placeholder="media_123"
                value={values.mediaId ?? ""}
                onChange={(e) => update("mediaId", e.target.value)}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Link URL</Label>
              <Input
                placeholder="https://example.com"
                value={values.linkUrl ?? ""}
                onChange={(e) => update("linkUrl", e.target.value)}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label>Link type</Label>
              <Select
                value={values.linkType ?? ""}
                onValueChange={(v) => update("linkType", v)}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại link" />
                </SelectTrigger>
                <SelectContent>
                  {LINK_TYPES.map((it) => (
                    <SelectItem key={it.value} value={it.value}>
                      {it.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="active"
                  checked={Boolean(values.active)}
                  onCheckedChange={(v) => update("active", Boolean(v))}
                  disabled={disabled}
                />
                <Label htmlFor="active" className="text-sm">
                  Đang bật
                </Label>
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Start date</Label>
              <Input
                type="date"
                value={values.startDate ?? ""}
                onChange={(e) => update("startDate", e.target.value)}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label>End date</Label>
              <Input
                type="date"
                value={values.endDate ?? ""}
                onChange={(e) => update("endDate", e.target.value)}
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
            disabled={Boolean(submitting) || !banner || !canSubmit}
          >
            {submitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
