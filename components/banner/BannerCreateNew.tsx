"use client";

import * as React from "react";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import {
  BANNER_LINK_TYPES,
  BANNER_TARGET_PAGES,
  createBannerDefaultValues,
  createBannerFormSchema,
  type CreateBannerFormValues,
} from "@/lib/schemas/banner";

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
  const form = useForm<CreateBannerFormValues>({
    resolver: zodResolver(createBannerFormSchema),
    defaultValues: createBannerDefaultValues,
  });

  const imageInputRef = React.useRef<HTMLInputElement | null>(null);
  const imageFile = useWatch({
    control: form.control,
    name: "imageFile",
  });

  const [previewUrl, setPreviewUrl] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      form.reset(createBannerDefaultValues);

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  }, [form, open]);

  React.useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-3xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Them banner</DialogTitle>
          <DialogDescription>Nhap thong tin banner moi.</DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
          <Separator className="my-4" />

          <form
            className="space-y-5"
            onSubmit={handleSubmit((values) => onSubmit?.(values))}
          >
            <FieldGroup className="grid gap-5 md:grid-cols-2">
              <Field className="md:col-span-2">
                <FieldLabel htmlFor="banner-title">Tieu de</FieldLabel>
                <FieldContent>
                  <Input
                    id="banner-title"
                    placeholder="Banner khuyen mai thang 5"
                    disabled={submitting}
                    aria-invalid={Boolean(errors.title)}
                    {...register("title")}
                  />
                  <FieldError errors={[errors.title]} />
                </FieldContent>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel htmlFor="banner-subtitle">Phu de</FieldLabel>
                <FieldContent>
                  <Input
                    id="banner-subtitle"
                    placeholder="Mo ta ngan..."
                    disabled={submitting}
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
                        disabled={submitting}
                      >
                        <SelectTrigger aria-invalid={Boolean(errors.targetPage)}>
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
                <FieldLabel htmlFor="banner-order">
                  Thu tu hien thi
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="banner-order"
                    type="number"
                    min={1}
                    disabled={submitting}
                    aria-invalid={Boolean(errors.displayOrder)}
                    {...register("displayOrder", { valueAsNumber: true })}
                  />
                  <FieldError errors={[errors.displayOrder]} />
                </FieldContent>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel htmlFor="banner-image">Anh banner</FieldLabel>
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
                        disabled={submitting}
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
                    disabled={submitting}
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
                        disabled={submitting}
                      >
                        <SelectTrigger aria-invalid={Boolean(errors.linkType)}>
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
                      disabled={submitting}
                    />
                  )}
                />
                <FieldLabel>Hoat dong</FieldLabel>
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
                    disabled={submitting}
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
                    disabled={submitting}
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
                disabled={submitting}
              >
                Huy
              </Button>

              <Button type="submit" disabled={submitting}>
                {submitting ? "Dang tao..." : "Tao banner"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
