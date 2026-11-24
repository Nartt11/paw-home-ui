"use client";

import { FirstAidTips, PossibleDuplicates } from "@/components/rescue-case/ReportHelpers";
import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Upload, X, Loader2, LocateFixedIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

import { useGeolocation } from "@/hooks/use-geolocation";
import { useResolveLocation } from "@/hooks/use-location";
import { usePetTaxonomy } from "@/hooks/use-pet";
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

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** A number a rescuer can call in Vietnam: 0 or +84, then 9–10 digits; spaces, dots and dashes are fine. */
function isCallablePhone(value: string) {
  return /^(?:\+84|0)\d{9,10}$/.test(value.replace(/[\s().-]+/g, ""));
}
const UNKNOWN_SPECIES = "__unknown";

type FieldKey = "location" | "contactPhone" | "images";

/** Errors for the fields people fill; empty means the field is fine. Shown under the field it is about. */
function validate(values: RescueCaseCreateValues): Partial<Record<FieldKey, string>> {
  const errors: Partial<Record<FieldKey, string>> = {};
  const hasPoint = Boolean(values.latitude) && Boolean(values.longitude);
  if (!hasPoint && !values.locationText.trim()) {
    errors.location = "Cho biết bé đang ở đâu: chọn trên bản đồ, bấm \"Dùng vị trí của tôi\" hoặc nhập địa chỉ.";
  }
  const phone = values.contactPhone?.trim() ?? "";
  if (phone && !isCallablePhone(phone)) {
    errors.contactPhone = "Số điện thoại chưa đúng: bắt đầu bằng 0 hoặc +84, ví dụ 0901234567.";
  }
  return errors;
}

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
  // on by default: most people meet a case in the feed, not on the map
  shareAsPost: true,
  postContent: "",
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
  const resolveLocation = useResolveLocation();
  const geolocation = useGeolocation();
  const taxonomy = usePetTaxonomy();
  // A field shows its error once the person has left it, or after they tried to send.
  const [touched, setTouched] = React.useState<Partial<Record<FieldKey, boolean>>>({});
  const [imageError, setImageError] = React.useState<string | null>(null);
  const errors = validate(values);
  const shown = (key: FieldKey) => (touched[key] ? errors[key] : undefined);
  const touch = (key: FieldKey) => setTouched((t) => ({ ...t, [key]: true }));

  /** A point from the map or the device: fill the ward and province the same way. */
  const pickPoint = React.useCallback(
    async (latitude: number, longitude: number) => {
      setValues((prev) => ({ ...prev, latitude, longitude }));
      setTouched((t) => ({ ...t, location: true }));
      try {
        const location = await resolveLocation(latitude, longitude);
        setValues((prev) => ({
          ...prev,
          latitude,
          longitude,
          wardName: location.wardName,
          wardCode: location.wardCode,
          provinceName: location.provinceName,
          provinceCode: location.provinceCode,
          locationText: location.displayName || prev.locationText,
        }));
      } catch (err) {
        console.error("Reverse geocoding failed", err);
      }
    },
    [resolveLocation],
  );


  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setValues(DEFAULT_VALUES);
        setTouched({});
        setImageError(null);
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
    const all = Array.from(e.target.files || []);
    if (!all.length) return;
    // Tell people at once which photos cannot go, instead of failing on send.
    const rejected = all.filter((file) => !file.type.startsWith("image/") || file.size > MAX_IMAGE_BYTES);
    const selected = all.filter((file) => !rejected.includes(file));
    setImageError(
      rejected.length
        ? `Bỏ qua ${rejected.length} ảnh không dùng được (chỉ nhận JPG, PNG, WebP, tối đa 5 MB): ${rejected.map((f) => f.name).join(", ")}`
        : null,
    );
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
    // Show every problem at its field and take the person to the first one.
    if (Object.keys(errors).length > 0) {
      setTouched({ location: true, contactPhone: true });
      const first = errors.location ? "create-rescue-location" : "create-rescue-phone";
      document.getElementById(first)?.focus();
      return;
    }
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

  const busy = Boolean(submitting) || uploading;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl bg-white">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Báo cáo ca cứu hộ mới</DialogTitle>
          <DialogDescription>
            Chỉ cần vị trí là gửi được. Ảnh và mô tả giúp người đến giúp nhận ra bé nhanh hơn.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
          <Separator className="my-4" />

          {/* REQUIRED FIELDS SECTION */}
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Ảnh ca cứu hộ (nên có, không bắt buộc)</Label>
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

              {imageError ? (
                <p id="create-rescue-images-error" className="text-sm text-destructive" role="alert">
                  {imageError}
                </p>
              ) : null}

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
                        aria-label={`Bỏ ảnh ${index + 1}`}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-black/85 transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 disabled:opacity-50 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="create-rescue-location" className="font-semibold text-gray-700">
                  Bé đang ở đâu? <span aria-hidden>*</span>
                  <span className="sr-only">(bắt buộc)</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => geolocation.locateThen((c) => void pickPoint(c.lat, c.lng))}
                  disabled={busy || geolocation.status === "locating"}
                >
                  {geolocation.status === "locating" ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <LocateFixedIcon className="size-4" aria-hidden />
                  )}
                  Dùng vị trí của tôi
                </Button>
              </div>
              <Input
                id="create-rescue-location"
                placeholder="Ví dụ: hẻm 12 Nguyễn Trãi, gần chợ Bến Thành"
                value={values.locationText}
                onChange={(e) => update("locationText", e.target.value)}
                onBlur={() => touch("location")}
                disabled={busy}
                aria-invalid={Boolean(shown("location"))}
                aria-describedby={shown("location") ? "create-rescue-location-error" : "create-rescue-location-hint"}
              />
              {shown("location") ? (
                <p id="create-rescue-location-error" className="text-sm text-destructive">
                  {shown("location")}
                </p>
              ) : (
                <p id="create-rescue-location-hint" className="text-xs text-muted-foreground">
                  {values.provinceName
                    ? `Đã nhận vị trí: ${[values.wardName, values.provinceName].filter(Boolean).join(", ")}`
                    : "Chỉ cần vị trí là gửi được."}
                </p>
              )}
              {geolocation.status === "denied" || geolocation.status === "unavailable" ? (
                <p className="text-sm text-amber-800" role="status">
                  {geolocation.status === "denied"
                    ? "Trình duyệt chưa cho phép lấy vị trí. Bạn có thể chọn trên bản đồ hoặc nhập địa chỉ."
                    : "Không lấy được vị trí lúc này. Hãy chọn trên bản đồ hoặc nhập địa chỉ."}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Chọn vị trí trên bản đồ</Label>
              <div className="overflow-hidden rounded-lg border">
                <LocationPickerMap
                  latitude={values.latitude || undefined}
                  longitude={values.longitude || undefined}
                  disabled={Boolean(submitting) || uploading}
                  onChange={({ latitude, longitude }) => void pickPoint(latitude, longitude)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Nhấn lên bản đồ hoặc kéo marker để tự động cập nhật địa chỉ.
              </p>
            </div>

            <PossibleDuplicates latitude={values.latitude} longitude={values.longitude} species={values.species} />
            <FirstAidTips />
          </div>

          <Separator className="my-6" />

          {/* OPTIONAL FIELDS SECTION */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Thông tin chi tiết (Không bắt buộc)</h3>
            
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="create-rescue-species">Loài</Label>
                {/* From the catalogue, so the backend never has to guess what was typed. */}
                <Select
                  value={values.species || UNKNOWN_SPECIES}
                  onValueChange={(v) => update("species", v === UNKNOWN_SPECIES ? "" : v)}
                  disabled={busy}
                >
                  <SelectTrigger id="create-rescue-species">
                    <SelectValue placeholder="Chọn loài" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UNKNOWN_SPECIES}>Chưa rõ</SelectItem>
                    {(taxonomy.data ?? []).map((species) => (
                      <SelectItem key={species.speciesId} value={species.name}>
                        {species.nameVi || species.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label htmlFor="create-rescue-phone">Số điện thoại liên hệ</Label>
                <Input
                  id="create-rescue-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0901234567"
                  value={values.contactPhone}
                  onChange={(e) => update("contactPhone", e.target.value)}
                  onBlur={() => touch("contactPhone")}
                  disabled={busy}
                  aria-invalid={Boolean(shown("contactPhone"))}
                  aria-describedby={shown("contactPhone") ? "create-rescue-phone-error" : "create-rescue-phone-hint"}
                />
                {shown("contactPhone") ? (
                  <p id="create-rescue-phone-error" className="text-sm text-destructive">
                    {shown("contactPhone")}
                  </p>
                ) : (
                  <p id="create-rescue-phone-hint" className="text-xs text-muted-foreground">
                    Chỉ người nhận ca, trạm và quản trị viên thấy số này.
                  </p>
                )}
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

          <Separator className="my-6" />

          {/* SHARE TO THE COMMUNITY FEED */}
          <div className="space-y-3 rounded-lg border border-orange-200 bg-orange-50/60 p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="create-rescue-share"
                checked={Boolean(values.shareAsPost)}
                onCheckedChange={(checked) => update("shareAsPost", checked === true)}
                disabled={Boolean(submitting) || uploading}
                className="mt-0.5"
              />
              <div className="space-y-1">
                <Label htmlFor="create-rescue-share" className="font-semibold text-gray-700">
                  Đăng lên cộng đồng để kêu gọi giúp
                </Label>
                <p className="text-xs text-muted-foreground">
                  Một bài đăng kèm ca này sẽ hiện trên bảng tin, nơi phần lớn mọi người nhìn thấy.
                </p>
              </div>
            </div>

            {values.shareAsPost ? (
              <textarea
                placeholder="Lời kêu gọi (để trống thì hệ thống tự viết từ loài, địa điểm và mô tả)"
                value={values.postContent ?? ""}
                maxLength={2000}
                onChange={(e) => update("postContent", e.target.value)}
                className="min-h-20 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={Boolean(submitting) || uploading}
              />
            ) : null}
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
            disabled={busy}
          >
            {submitting || uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Gửi báo cứu hộ"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
