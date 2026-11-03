"use client";

import * as React from "react";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  BANNER_LINK_TYPES,
  BANNER_TARGET_PAGES,
  createBannerDefaultValues,
  createBannerFormSchema,
  type CreateBannerFormValues,
} from "@/lib/schemas/banner";
import { useUploadTempMedia } from "@/hooks/use-media";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export interface BannerCreateNewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitting?: boolean;
  onSubmit?: (values: CreateBannerFormValues) => void;
}

export function BannerCreateNew({
  open,
  onOpenChange,
  submitting = false,
  onSubmit,
}: BannerCreateNewProps) {
  const uploadTempMediaMutation = useUploadTempMedia();
  const form = useForm<CreateBannerFormValues>({
    resolver: zodResolver(createBannerFormSchema),
    defaultValues: createBannerDefaultValues,
  });

  const imageInputRef = React.useRef<HTMLInputElement | null>(null);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      form.reset(createBannerDefaultValues);

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  }, [form, open]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = form;

  const handleImageChange = React.useCallback(
    async (
      event: React.ChangeEvent<HTMLInputElement>,
      onChange: (value: File | null) => void,
    ) => {
      const file = event.target.files?.[0] ?? null;

      onChange(file);

      if (!file) {
        setValue("mediaId", "", {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
        setUploadedPreviewUrl("");
        return;
      }

      try {
        const media = await uploadTempMediaMutation.mutateAsync({
          file,
          folder: "temp/banners",
        });

        setValue("mediaId", media.mediaId, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
        setUploadedPreviewUrl(media.url);
        toast.success("Tải ảnh banner thành công");
      } catch (error) {
        setValue("mediaId", "", {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
        setUploadedPreviewUrl("");
        onChange(null);

        if (imageInputRef.current) {
          imageInputRef.current.value = "";
        }

        toast.error(
          error instanceof Error ? error.message : "Không thể tải ảnh lên",
        );
      }
    },
    [setValue, uploadTempMediaMutation],
  );

  const handleDialogOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setUploadedPreviewUrl("");
      }

      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  const isBusy = submitting || uploadTempMediaMutation.isPending;
  const previewUrl = uploadedPreviewUrl;

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-3xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Thêm banner</DialogTitle>
          <DialogDescription>Nhập thông tin banner mới.</DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
          <Separator className="my-4" />

          <form
            className="space-y-5"
            onSubmit={handleSubmit((values) => onSubmit?.(values))}
          >
            <FieldGroup className="grid gap-5 md:grid-cols-2">
              <Field className="md:col-span-2">
                <FieldLabel htmlFor="banner-title">Tiêu đề</FieldLabel>
                <FieldContent>
                  <Input
                    id="banner-title"
                    placeholder="Banner khuyến mãi tháng 5"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.title)}
                    {...register("title")}
                  />
                  <FieldError errors={[errors.title]} />
                </FieldContent>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel htmlFor="banner-subtitle">Phụ đề</FieldLabel>
                <FieldContent>
                  <Input
                    id="banner-subtitle"
                    placeholder="Mô tả ngắn..."
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.subtitle)}
                    {...register("subtitle")}
                  />
                  <FieldError errors={[errors.subtitle]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Target page</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name="targetPage"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isBusy}
                      >
                        <SelectTrigger aria-invalid={Boolean(errors.targetPage)}>
                          <SelectValue placeholder="Chọn trang" />
                        </SelectTrigger>
                        <SelectContent>
                          {BANNER_TARGET_PAGES.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.targetPage]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="banner-order">
                  Thứ tự hiển thị
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="banner-order"
                    type="number"
                    min={1}
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.displayOrder)}
                    {...register("displayOrder", { valueAsNumber: true })}
                  />
                  <FieldError errors={[errors.displayOrder]} />
                </FieldContent>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel htmlFor="banner-image">Ảnh banner</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name="imageFile"
                    render={({ field }) => (
                      <Input
                        id="banner-image"
                        ref={imageInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={isBusy}
                        onChange={(event) =>
                          handleImageChange(event, field.onChange)
                        }
                      />
                    )}
                  />
                  <FieldError errors={[errors.imageFile]} />
                  {uploadTempMediaMutation.isPending ? (
                    <p className="text-sm text-muted-foreground">
                      Đang tải ảnh lên...
                    </p>
                  ) : null}
                  {previewUrl ? (
                    <div className="overflow-hidden rounded-lg border">
                      <div className="relative h-48 w-full">
                        <Image
                          src={previewUrl}
                          alt="Banner preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                  ) : null}
                </FieldContent>
              </Field>
            </FieldGroup>

            <Separator className="my-5" />

            <FieldGroup className="grid gap-5 md:grid-cols-2">
              <Field className="md:col-span-2">
                <FieldLabel htmlFor="banner-link-url">Link URL</FieldLabel>
                <FieldContent>
                  <Input
                    id="banner-link-url"
                    placeholder="https://example.com"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.linkUrl)}
                    {...register("linkUrl")}
                  />
                  <FieldError errors={[errors.linkUrl]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Link type</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name="linkType"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isBusy}
                      >
                        <SelectTrigger aria-invalid={Boolean(errors.linkType)}>
                          <SelectValue placeholder="Chọn loại liên kết" />
                        </SelectTrigger>
                        <SelectContent>
                          {BANNER_LINK_TYPES.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.linkType]} />
                </FieldContent>
              </Field>

              <Field orientation="horizontal" className="items-end gap-3">
                <Controller
                  control={control}
                  name="active"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(Boolean(checked))
                      }
                      disabled={isBusy}
                    />
                  )}
                />
                <FieldLabel>Hoạt động</FieldLabel>
              </Field>
            </FieldGroup>

            <Separator className="my-5" />

            <FieldGroup className="grid gap-5 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="banner-start-date">Start date</FieldLabel>
                <FieldContent>
                  <Input
                    id="banner-start-date"
                    type="datetime-local"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.startDate)}
                    {...register("startDate")}
                  />
                  <FieldError errors={[errors.startDate]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="banner-end-date">End date</FieldLabel>
                <FieldContent>
                  <Input
                    id="banner-end-date"
                    type="datetime-local"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.endDate)}
                    {...register("endDate")}
                  />
                  <FieldError errors={[errors.endDate]} />
                </FieldContent>
              </Field>
            </FieldGroup>

            <DialogFooter className="px-0 pb-0 pt-6">
              <Button
                variant="secondary"
                type="button"
                onClick={() => handleDialogOpenChange(false)}
                disabled={isBusy}
              >
                Hủy
              </Button>

              <Button type="submit" disabled={isBusy}>
                {uploadTempMediaMutation.isPending
                  ? "Đang tải ảnh..."
                  : submitting
                    ? "Đang tạo..."
                    : "Tạo banner"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
