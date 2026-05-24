"use client";

import * as React from "react";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import {
  BANNER_LINK_TYPES,
  BANNER_TARGET_PAGES,
  getUpdateBannerDefaultValues,
  updateBannerFormSchema,
  type UpdateBannerFormValues,
} from "@/lib/schemas/banner";
import type { Banner } from "@/types/banner.type";

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

export interface BannerUpdateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  submitting?: boolean;
  banner?: Banner | null;
  onSubmit?: (values: UpdateBannerFormValues) => void;
}

export function BannerUpdate({
  open,
  onOpenChange,
  loading = false,
  submitting = false,
  banner,
  onSubmit,
}: BannerUpdateProps) {
  const form = useForm<UpdateBannerFormValues>({
    resolver: zodResolver(updateBannerFormSchema),
    defaultValues: getUpdateBannerDefaultValues(),
  });

  const imageInputRef = React.useRef<HTMLInputElement | null>(null);
  const imageFile = useWatch({
    control: form.control,
    name: "imageFile",
  });

  const [previewUrl, setPreviewUrl] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      form.reset(getUpdateBannerDefaultValues());

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }

      return;
    }

    form.reset(getUpdateBannerDefaultValues(banner));

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }, [banner, form, open]);


  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = form;

  const isBusy = loading || submitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Cap nhat banner</DialogTitle>
          <DialogDescription>
            Chinh sua thong tin banner va luu thay doi.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
          <Separator className="my-4" />

          {loading && !banner ? (
            <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
              Dang tai du lieu banner...
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={handleSubmit((values) => onSubmit?.(values))}
            >
              <FieldGroup className="grid gap-5 md:grid-cols-2">
                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="update-banner-title">Tieu de</FieldLabel>
                  <FieldContent>
                    <Input
                      id="update-banner-title"
                      placeholder="Banner khuyen mai thang 5"
                      disabled={isBusy || !banner}
                      aria-invalid={Boolean(errors.title)}
                      {...register("title")}
                    />
                    <FieldError errors={[errors.title]} />
                  </FieldContent>
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="update-banner-subtitle">
                    Phu de
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="update-banner-subtitle"
                      placeholder="Mo ta ngan..."
                      disabled={isBusy || !banner}
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
                          disabled={isBusy || !banner}
                        >
                          <SelectTrigger
                            aria-invalid={Boolean(errors.targetPage)}
                          >
                            <SelectValue placeholder="Chon trang" />
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
                  <FieldLabel htmlFor="update-banner-order">
                    Thu tu hien thi
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="update-banner-order"
                      type="number"
                      min={1}
                      disabled={isBusy || !banner}
                      aria-invalid={Boolean(errors.displayOrder)}
                      {...register("displayOrder", { valueAsNumber: true })}
                    />
                    <FieldError errors={[errors.displayOrder]} />
                  </FieldContent>
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="update-banner-image">
                    Anh banner
                  </FieldLabel>
                  <FieldContent>
                    <Controller
                      control={control}
                      name="imageFile"
                      render={({ field }) => (
                        <Input
                          id="update-banner-image"
                          ref={imageInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={isBusy || !banner}
                          onChange={(event) =>
                            field.onChange(event.target.files?.[0] ?? null)
                          }
                        />
                      )}
                    />
                    <FieldError errors={[errors.imageFile]} />
                    {previewUrl ? (
                      <div className="overflow-hidden rounded-lg border">
                        <div className="relative h-48 w-full">
                          <Image
                            src={previewUrl}
                            alt={banner?.title || "Banner preview"}
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
                  <FieldLabel htmlFor="update-banner-link-url">
                    Link URL
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="update-banner-link-url"
                      placeholder="https://example.com"
                      disabled={isBusy || !banner}
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
                          disabled={isBusy || !banner}
                        >
                          <SelectTrigger
                            aria-invalid={Boolean(errors.linkType)}
                          >
                            <SelectValue placeholder="Chon loai link" />
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
                        disabled={isBusy || !banner}
                      />
                    )}
                  />
                  <FieldLabel>Hoat dong</FieldLabel>
                </Field>
              </FieldGroup>

              <Separator className="my-5" />

              <FieldGroup className="grid gap-5 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="update-banner-start-date">
                    Start date
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="update-banner-start-date"
                      type="date"
                      disabled={isBusy || !banner}
                      aria-invalid={Boolean(errors.startDate)}
                      {...register("startDate")}
                    />
                    <FieldError errors={[errors.startDate]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="update-banner-end-date">
                    End date
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="update-banner-end-date"
                      type="date"
                      disabled={isBusy || !banner}
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
                  onClick={() => onOpenChange(false)}
                  disabled={isBusy}
                >
                  Huy
                </Button>
                <Button type="submit" disabled={isBusy || !banner}>
                  {submitting ? "Dang luu..." : "Luu thay doi"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
