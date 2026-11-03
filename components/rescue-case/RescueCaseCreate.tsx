"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

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

import { useUploadTempMedia } from "@/hooks/use-media";
import type { RescueCasePayload, RescueCasePriority } from "@/types/rescue-case.type";

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

export type RescueCaseCreateValues = RescueCasePayload;

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
  imageUrls: [],
  mediaIds: [],
  contactPhone: "",
};

export function RescueCaseCreate({
  open,
  onOpenChange,
  submitting,
  onSubmit,
}: RescueCaseCreateProps) {
  const [values, setValues] =
    React.useState<RescueCaseCreateValues>(DEFAULT_VALUES);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const uploadMediaMutation = useUploadTempMedia();

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setValues(DEFAULT_VALUES);
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
        setPreviewUrls([]);
        setSelectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange, previewUrls],
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    setSelectedFiles((prev) => [...prev, ...selected]);
    
    const nextPreviews = selected.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...nextPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Cleanup previews on unmount/close
  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFormSubmit = async () => {
    setUploading(true);
    try {
      let mediaIds: string[] = [];
      let imageUrls: string[] = [];

      if (selectedFiles.length > 0) {
        const uploadedMedia = await Promise.all(
          selectedFiles.map((file) =>
            uploadMediaMutation.mutateAsync({ file })
          )
        );
        mediaIds = uploadedMedia.map((m) => m.mediaId);
        imageUrls = uploadedMedia.map((m) => m.url);
      }

      onSubmit?.({
        ...values,
        mediaIds,
        imageUrls,
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải ảnh lên.");
    } finally {
      setUploading(false);
    }
  };

  const canSubmit = React.useMemo(() => {
    return (
      Boolean(values.locationText.trim()) &&
      selectedFiles.length > 0
    );
  }, [
    values.locationText,
    selectedFiles.length,
  ]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl bg-white">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Báo cáo ca cứu hộ mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin ca cứu hộ. 
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
          <Separator className="my-4" />

          {/* REQUIRED FIELDS SECTION */}
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Ảnh ca cứu hộ *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="create-rescue-images"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  disabled={Boolean(submitting) || uploading}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={Boolean(submitting) || uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full gap-2 border-dashed border-2 py-6 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  Tải lên ảnh ca cứu hộ (Tối đa 5MB mỗi ảnh)
                </Button>
              </div>

              {previewUrls.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {previewUrls.map((url, index) => (
                    <div
                      key={url}
                      className="relative group aspect-square rounded-xl overflow-hidden border bg-muted"
                    >
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        disabled={Boolean(submitting) || uploading}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-black/85 transition opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Địa điểm *</Label>
              <Input
                placeholder="Ví dụ: 12 Nguyễn Trãi, Q.1"
                value={values.locationText}
                onChange={(e) => update("locationText", e.target.value)}
                disabled={Boolean(submitting) || uploading}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Chọn vị trí trên bản đồ</Label>
              <div className="overflow-hidden rounded-lg border">
                <LocationPickerMap
                  latitude={values.latitude || undefined}
                  longitude={values.longitude || undefined}
                  disabled={Boolean(submitting) || uploading}
                  onChange={async ({ latitude, longitude }) => {
                    update("latitude", latitude);
                    update("longitude", longitude);
                    
                    try {
                      const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=vi`
                      );
                      const data = await res.json();
                      if (data && data.address) {
                        const addr = data.address;
                        const ward = addr.suburb || addr.quarter || addr.town || addr.village || addr.ward || "";
                        const province = addr.city || addr.state || addr.province || "";
                        
                        setValues((prev) => ({
                          ...prev,
                          latitude,
                          longitude,
                          wardName: ward,
                          provinceName: province,
                          locationText: data.display_name || prev.locationText,
                          provinceCode: addr.postcode || prev.provinceCode || "79",
                          wardCode: addr.postcode ? addr.postcode.substring(0, 5) : prev.wardCode || "00001",
                        }));
                      }
                    } catch (err) {
                      console.error("Reverse geocoding failed", err);
                    }
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Nhấn lên bản đồ hoặc kéo marker để tự động cập nhật địa chỉ.
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* OPTIONAL FIELDS SECTION */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Thông tin chi tiết (Không bắt buộc)</h3>
            
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Loài</Label>
                <Input
                  placeholder="Chó / Mèo..."
                  value={values.species}
                  onChange={(e) => update("species", e.target.value)}
                  disabled={Boolean(submitting) || uploading}
                />
              </div>

              <div className="space-y-2">
                <Label>Mức độ ưu tiên</Label>
                <Select
                  value={values.priority}
                  onValueChange={(v) =>
                    update("priority", v as RescueCasePriority)
                  }
                  disabled={Boolean(submitting) || uploading}
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
                  disabled={Boolean(submitting) || uploading}
                />
              </div>

              <div className="space-y-2">
                <Label>Kích thước</Label>
                <Input
                  placeholder="Nhỏ / Vừa / Lớn"
                  value={values.size}
                  onChange={(e) => update("size", e.target.value)}
                  disabled={Boolean(submitting) || uploading}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Số điện thoại liên hệ</Label>
                <Input
                  placeholder="09xxxxxxxx"
                  value={values.contactPhone}
                  onChange={(e) => update("contactPhone", e.target.value)}
                  disabled={Boolean(submitting) || uploading}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Mô tả</Label>
                <textarea
                  placeholder="Mô tả tình trạng, dấu hiệu nhận biết..."
                  value={values.description}
                  onChange={(e) => update("description", e.target.value)}
                  className="min-h-28 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={Boolean(submitting) || uploading}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 bg-gray-50/50 py-4 border-t rounded-b-lg">
          <Button
            variant="secondary"
            type="button"
            onClick={() => handleOpenChange(false)}
            disabled={Boolean(submitting) || uploading}
          >
            Huỷ
          </Button>
          <Button
            type="button"
            onClick={handleFormSubmit}
            disabled={Boolean(submitting) || uploading || !canSubmit}
          >
            {submitting || uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Tạo ca cứu hộ"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
