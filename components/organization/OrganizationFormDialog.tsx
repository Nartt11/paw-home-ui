"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useProvinceDetail, useProvinces } from "@/hooks/use-location";
import {
  organizationFormDefaultValues,
  organizationFormSchema,
  toOrganizationFormValues,
  toOrganizationPayload,
  type OrganizationFormInput,
  type OrganizationFormValues,
} from "@/lib/schemas/organization";
import type {
  Organization,
  OrganizationCreatePayload,
  OrganizationType,
} from "@/types/organization.type";

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

const ORGANIZATION_TYPES: Array<{ value: OrganizationType; label: string }> = [
  { value: "SHELTER", label: "Mái ấm" },
  { value: "VET_CENTER", label: "Cơ sở thú y" },
];

export interface OrganizationFormDialogProps {
  mode: "create" | "update";
  open: boolean;
  organization?: Organization | null;
  loading?: boolean;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (payload: OrganizationCreatePayload) => void;
}

export function OrganizationFormDialog({
  mode,
  open,
  organization,
  loading,
  submitting,
  onOpenChange,
  onSubmit,
}: OrganizationFormDialogProps) {
  const form = useForm<OrganizationFormInput, unknown, OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: organizationFormDefaultValues,
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = form;

  // Dialog luôn được mount, nên phải đổ lại dữ liệu mỗi khi mở hoặc khi chi tiết tải xong
  React.useEffect(() => {
    if (!open || !organization) {
      reset(organizationFormDefaultValues);
      return;
    }

    reset(toOrganizationFormValues(organization));
  }, [open, organization, reset]);

  const provinceCode = useWatch({ control, name: "provinceCode" });
  const provinceName = useWatch({ control, name: "provinceName" });
  const wardName = useWatch({ control, name: "wardName" });
  const latitude = useWatch({ control, name: "latitude" });
  const longitude = useWatch({ control, name: "longitude" });

  const provincesQuery = useProvinces();
  const provinceDetailQuery = useProvinceDetail(provinceCode || undefined);
  const provinces = provincesQuery.data?.content ?? [];
  const wards = provinceDetailQuery.data?.wards ?? [];

  const isCreate = mode === "create";
  const isBusy = Boolean(submitting) || (!isCreate && !organization);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {isCreate ? "Tạo mới trung tâm" : "Cập nhật trung tâm"}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Nhập thông tin cơ bản của mái ấm / cơ sở cứu hộ."
              : "Chỉnh sửa thông tin trung tâm và lưu thay đổi."}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
          <Separator className="my-4" />

          {!isCreate && loading && !organization ? (
            <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
              Đang tải dữ liệu trung tâm...
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={handleSubmit((values) =>
                onSubmit?.(toOrganizationPayload(values)),
              )}
            >
              <FieldGroup className="grid gap-5 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="organization-name">
                    Tên trung tâm
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="organization-name"
                      placeholder="Happy Paws Shelter"
                      disabled={isBusy}
                      aria-invalid={Boolean(errors.name)}
                      {...register("name")}
                    />
                    <FieldError errors={[errors.name]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Loại</FieldLabel>
                  <FieldContent>
                    <Controller
                      control={control}
                      name="type"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isBusy}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn loại" />
                          </SelectTrigger>
                          <SelectContent>
                            {ORGANIZATION_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FieldContent>
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="organization-description">
                    Mô tả
                  </FieldLabel>
                  <FieldContent>
                    <Textarea
                      id="organization-description"
                      placeholder="Mô tả ngắn về trung tâm..."
                      disabled={isBusy}
                      aria-invalid={Boolean(errors.description)}
                      {...register("description")}
                    />
                    <FieldError errors={[errors.description]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="organization-email">Email</FieldLabel>
                  <FieldContent>
                    <Input
                      id="organization-email"
                      type="email"
                      placeholder="contact@shelter.vn"
                      disabled={isBusy}
                      aria-invalid={Boolean(errors.email)}
                      {...register("email")}
                    />
                    <FieldError errors={[errors.email]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="organization-phone">
                    Điện thoại
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="organization-phone"
                      placeholder="+84-28-1234-5678"
                      disabled={isBusy}
                      aria-invalid={Boolean(errors.phone)}
                      {...register("phone")}
                    />
                    <FieldError errors={[errors.phone]} />
                  </FieldContent>
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="organization-link">
                    Liên kết chính thức
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="organization-link"
                      placeholder="https://facebook.com/happypaws"
                      disabled={isBusy}
                      aria-invalid={Boolean(errors.officialLink)}
                      {...register("officialLink")}
                    />
                    <FieldError errors={[errors.officialLink]} />
                  </FieldContent>
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="organization-street">Địa chỉ</FieldLabel>
                  <FieldContent>
                    <Input
                      id="organization-street"
                      placeholder="123 Nguyễn Trãi"
                      disabled={isBusy}
                      aria-invalid={Boolean(errors.streetAddress)}
                      {...register("streetAddress")}
                    />
                    <FieldError errors={[errors.streetAddress]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Tỉnh / Thành phố</FieldLabel>
                  <FieldContent>
                    <Controller
                      control={control}
                      name="provinceCode"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(code) => {
                            // Radix gọi với "" khi danh sách option chưa tải xong
                            if (!code) return;

                            const province = provinces.find(
                              (item) => String(item.code) === code,
                            );
                            field.onChange(code);
                            setValue("provinceName", province?.name ?? "");
                            setValue("wardCode", "");
                            setValue("wardName", "");
                          }}
                          disabled={isBusy || provincesQuery.isPending}
                        >
                          <SelectTrigger
                            className="w-full"
                            aria-invalid={Boolean(errors.provinceCode)}
                          >
                            <SelectValue
                              placeholder={provinceName || "Chọn tỉnh / thành phố"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {provinces.map((province) => (
                              <SelectItem
                                key={province.code}
                                value={String(province.code)}
                              >
                                {province.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError errors={[errors.provinceCode]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Phường / Xã</FieldLabel>
                  <FieldContent>
                    <Controller
                      control={control}
                      name="wardCode"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(code) => {
                            if (!code) return;

                            const ward = wards.find(
                              (item) => String(item.code) === code,
                            );
                            field.onChange(code);
                            setValue("wardName", ward?.name ?? "");
                          }}
                          disabled={
                            isBusy ||
                            !provinceCode ||
                            provinceDetailQuery.isPending
                          }
                        >
                          <SelectTrigger
                            className="w-full"
                            aria-invalid={Boolean(errors.wardCode)}
                          >
                            <SelectValue
                              placeholder={wardName || "Chọn phường / xã"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {wards.map((ward) => (
                              <SelectItem
                                key={ward.code}
                                value={String(ward.code)}
                              >
                                {ward.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError errors={[errors.wardCode]} />
                  </FieldContent>
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel>Chọn vị trí trên bản đồ</FieldLabel>
                  <FieldContent>
                    <div className="overflow-hidden rounded-lg border">
                      <LocationPickerMap
                        latitude={latitude}
                        longitude={longitude}
                        disabled={isBusy}
                        onChange={(coords) => {
                          setValue("latitude", coords.latitude, {
                            shouldValidate: true,
                          });
                          setValue("longitude", coords.longitude, {
                            shouldValidate: true,
                          });
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Nhấn lên bản đồ hoặc kéo marker để chọn tọa độ.
                      {typeof latitude === "number" &&
                      typeof longitude === "number"
                        ? ` Đã chọn: ${latitude}, ${longitude}.`
                        : ""}
                    </p>
                    <FieldError errors={[errors.latitude]} />
                  </FieldContent>
                </Field>
              </FieldGroup>

              <DialogFooter className="px-0 pb-0 pt-6">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => onOpenChange(false)}
                  disabled={Boolean(submitting)}
                >
                  Huỷ
                </Button>
                <Button type="submit" disabled={isBusy}>
                  {submitting
                    ? isCreate
                      ? "Đang tạo..."
                      : "Đang lưu..."
                    : isCreate
                      ? "Tạo mới"
                      : "Lưu thay đổi"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
