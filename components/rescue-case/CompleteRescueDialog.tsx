"use client";

import * as React from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
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
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import { useUploadTempMedia } from "@/hooks/use-media";
import { useCompleteRescue } from "@/hooks/use-rescue-case";
import { completeRescueSchema, type CompleteRescueFormValues } from "@/lib/schemas/rescue";
import { toApiDateTime, toDateTimeLocalValue } from "@/lib/datetime";

interface CompleteRescueDialogProps {
  rescueId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CompleteRescueDialog({
  rescueId,
  open,
  onOpenChange,
  onSuccess,
}: CompleteRescueDialogProps) {
  const completeMutation = useCompleteRescue();
  const uploadMediaMutation = useUploadTempMedia();
  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const defaultValues: CompleteRescueFormValues = React.useMemo(() => ({
    verificationImages: [],
    rescueNote: "",
    // now, in Vietnam: toISOString() would show the UTC time, 7 hours behind
    rescuedAt: toDateTimeLocalValue(),
    locationNote: "",
    confirmRescued: false,
  }), []);

  const form = useForm<CompleteRescueFormValues>({
    resolver: zodResolver(completeRescueSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = form;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
        setPreviewUrls([]);
        reset(defaultValues);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange, previewUrls, reset, defaultValues],
  );

  // Clean up object URLs on unmount
  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    const currentFiles = getValues("verificationImages") || [];
    const nextFiles = [...currentFiles, ...selectedFiles];

    setValue("verificationImages", nextFiles, { shouldValidate: true });

    const nextPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...nextPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    const currentFiles = getValues("verificationImages") || [];
    const nextFiles = currentFiles.filter((_, i) => i !== index);

    setValue("verificationImages", nextFiles, { shouldValidate: true });

    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));

    // Clear file input value to allow selecting same file again if array is empty
    if (nextFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = async (values: CompleteRescueFormValues) => {
    try {
      // 1. Upload verification images first
      const uploadedMedia = await Promise.all(
        values.verificationImages.map((file) =>
          uploadMediaMutation.mutateAsync({ file })
        )
      );
      const verificationImageIds = uploadedMedia.map((m) => m.mediaId);

      // 2. Submit rescue completion with the retrieved image IDs
      await completeMutation.mutateAsync({
        id: rescueId,
        payload: {
          caseId: rescueId,
          verificationImageIds,
          rescueNote: values.rescueNote,
          rescuedAt: toApiDateTime(values.rescuedAt),
          locationNote: values.locationNote,
          confirmRescued: values.confirmRescued,
        },
      });

      toast.success("Xác nhận cứu hộ thành công!");
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Có lỗi xảy ra khi hoàn tất cứu hộ."
      );
    }
  };

  const isPending = completeMutation.isPending || uploadMediaMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(val) => !isPending && handleOpenChange(val)}>
      <DialogContent className="w-full p-0 sm:max-w-2xl bg-white">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Xác nhận cứu hộ thành công</DialogTitle>
          <DialogDescription>
            Cung cấp thông tin xác thực quá trình cứu hộ thành công cho ca này.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
            <Separator className="my-4" />

            <div className="space-y-5">
              <FieldGroup className="grid gap-5">
                <Field>
                  <FieldLabel htmlFor="rescued-at">Thời gian cứu hộ thành công *</FieldLabel>
                  <FieldContent>
                    <Input
                      id="rescued-at"
                      type="datetime-local"
                      disabled={isPending}
                      aria-invalid={Boolean(errors.rescuedAt)}
                      {...form.register("rescuedAt")}
                    />
                    <FieldError errors={[errors.rescuedAt]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="verification-images">Ảnh xác thực cứu hộ *</FieldLabel>
                  <FieldContent>
                    <div className="flex items-center gap-2">
                      <Input
                        id="verification-images"
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        disabled={isPending}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full gap-2 border-dashed border-2 py-6 cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        Tải lên ảnh xác thực (JPEG, PNG, WEBP tối đa 5MB)
                      </Button>
                    </div>
                    <FieldError errors={[errors.verificationImages]} />

                    {previewUrls.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-3">
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
                              disabled={isPending}
                              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-black/85 transition opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50 cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="rescue-note">Ghi chú quá trình cứu hộ</FieldLabel>
                  <FieldContent>
                    <Textarea
                      id="rescue-note"
                      placeholder="Mô tả tóm tắt quá trình cứu hộ thành công..."
                      disabled={isPending}
                      rows={3}
                      aria-invalid={Boolean(errors.rescueNote)}
                      {...form.register("rescueNote")}
                    />
                    <FieldError errors={[errors.rescueNote]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="location-note">Ghi chú vị trí bàn giao/tiếp nhận</FieldLabel>
                  <FieldContent>
                    <Input
                      id="location-note"
                      placeholder="Ví dụ: Đã bàn giao cho trung tâm cứu trợ chó mèo Quận 7"
                      disabled={isPending}
                      aria-invalid={Boolean(errors.locationNote)}
                      {...form.register("locationNote")}
                    />
                    <FieldError errors={[errors.locationNote]} />
                  </FieldContent>
                </Field>

                <Field orientation="horizontal" className="items-start gap-3 pt-2">
                  <Controller
                    control={control}
                    name="confirmRescued"
                    render={({ field }) => (
                      <Checkbox
                        id="confirm-rescued"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                        disabled={isPending}
                      />
                    )}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <FieldLabel htmlFor="confirm-rescued" className="cursor-pointer">
                      Tôi xác nhận thú đã được cứu hộ thành công
                    </FieldLabel>
                    <FieldError errors={[errors.confirmRescued]} />
                  </div>
                </Field>
              </FieldGroup>
            </div>
          </div>

          <DialogFooter className="px-6 pb-6 bg-gray-50/50 py-4 border-t rounded-b-lg">
            <Button
              variant="secondary"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Xác nhận hoàn tất"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
