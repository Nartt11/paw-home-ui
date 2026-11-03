"use client";

import * as React from "react";
import Image from "next/image";

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
import { RescueCaseSelect } from "@/components/rescue-case/RescueCaseSelect";
import { useUploadTempMedia } from "@/hooks/use-media";
import { usePetTaxonomy } from "@/hooks/use-pet";
import {
  ACCEPTED_PET_IMAGE_TYPES,
  createPetDefaultValues,
  createPetSchema,
  MAX_PET_IMAGE_SIZE,
  MAX_PET_IMAGES,
  PET_HEALTH_STATUS_VALUES,
  toCreatePetPayload,
  type CreatePetFormInput,
  type CreatePetFormValues,
} from "@/lib/schemas/create-pet.schema";
import type { OrganizationSummary } from "@/types/organization.type";
import type {
  PetCreatePayload,
  PetGender,
  PetHealthStatus,
} from "@/types/pet.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

export type CreateNewPetValues = CreatePetFormValues;

export interface CreateNewPetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitting?: boolean;
  organizations?: OrganizationSummary[];
  onSubmit?: (values: Partial<PetCreatePayload>) => void;
}

const GENDERS: Array<{ value: PetGender; label: string }> = [
  { value: "MALE", label: "Đực" },
  { value: "FEMALE", label: "Cái" },
  { value: "UNKNOWN", label: "Không rõ" },
];

const NO_BREED = "none";

const HEALTH_STATUSES: Array<{ value: PetHealthStatus; label: string }> = [
  { value: "HEALTHY", label: "Khỏe mạnh" },
  { value: "UNDER_TREATMENT", label: "Đang điều trị" },
  { value: "RECOVERING", label: "Đang hồi phục" },
  { value: "SPECIAL_NEEDS", label: "Chăm sóc đặc biệt" },
];

function validatePetImages(files: File[]) {
  const invalidTypeFiles = files.filter(
    (file) =>
      !ACCEPTED_PET_IMAGE_TYPES.includes(
        file.type as (typeof ACCEPTED_PET_IMAGE_TYPES)[number],
      ),
  );

  if (invalidTypeFiles.length > 0) {
    toast.error("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP");
    return false;
  }

  const oversizedFiles = files.filter((file) => file.size > MAX_PET_IMAGE_SIZE);

  if (oversizedFiles.length > 0) {
    toast.error("Mỗi ảnh không được vượt quá 5MB");
    return false;
  }

  return true;
}

export function PetCreateNew({
  open,
  onOpenChange,
  submitting,
  organizations = [],
  onSubmit,
}: CreateNewPetProps) {
  const imageInputRef = React.useRef<HTMLInputElement | null>(null);
  const uploadTempMediaMutation = useUploadTempMedia();
  const taxonomyQuery = usePetTaxonomy();

  const form = useForm<CreatePetFormInput, unknown, CreatePetFormValues>({
    resolver: zodResolver(createPetSchema),
    defaultValues: createPetDefaultValues,
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = form;

  const imageUrls = useWatch({
    control,
    name: "imageUrls",
  });

  const mediaIds = useWatch({
    control,
    name: "mediaIds",
  });

  const speciesId = useWatch({
    control,
    name: "speciesId",
  });

  const speciesOptions = taxonomyQuery.data ?? [];
  const breedOptions =
    speciesOptions.find((species) => species.speciesId === speciesId)?.breeds ??
    [];

  // Người dùng tổ chức chỉ có một lựa chọn trung tâm
  const onlyOrganizationId =
    organizations.length === 1 ? organizations[0].organizationId : undefined;

  React.useEffect(() => {
    if (open && onlyOrganizationId) {
      setValue("shelterId", onlyOrganizationId);
    }
  }, [open, onlyOrganizationId, setValue]);

  React.useEffect(() => {
    if (!open) {
      reset(createPetDefaultValues);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  }, [open, reset]);

  const handleImageChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);

      if (files.length === 0) return;

      if (!validatePetImages(files)) {
        event.target.value = "";
        return;
      }

      if ((imageUrls ?? []).length + files.length > MAX_PET_IMAGES) {
        toast.error(`Chỉ được tải lên tối đa ${MAX_PET_IMAGES} ảnh`);
        event.target.value = "";
        return;
      }

      try {
        const uploads = await Promise.all(
          files.map((file) =>
            uploadTempMediaMutation.mutateAsync({
              file,
            }),
          ),
        );

        setValue(
          "imageUrls",
          [...(imageUrls ?? []), ...uploads.map((upload) => upload.url)],
          {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          },
        );
        setValue(
          "mediaIds",
          [...(mediaIds ?? []), ...uploads.map((upload) => upload.mediaId)],
          {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          },
        );

        toast.success(`Tải lên thành công ${uploads.length} ảnh`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Không thể tải ảnh lên",
        );
      }

      event.target.value = "";
    },
    [imageUrls, mediaIds, setValue, uploadTempMediaMutation],
  );

  const removeImage = React.useCallback(
    (index: number) => {
      const nextImageUrls = (imageUrls ?? []).filter(
        (_, currentIndex) => currentIndex !== index,
      );
      const nextMediaIds = (mediaIds ?? []).filter(
        (_, currentIndex) => currentIndex !== index,
      );

      setValue("imageUrls", nextImageUrls, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("mediaIds", nextMediaIds, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      if (nextImageUrls.length === 0 && imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    },
    [imageUrls, mediaIds, setValue],
  );

  const clearImages = React.useCallback(() => {
    setValue("imageUrls", [], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("mediaIds", [], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }, [setValue]);

  const isBusy = Boolean(submitting) || uploadTempMediaMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Thêm thú cưng</DialogTitle>
          <DialogDescription>Nhập thông tin thú cưng.</DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">

          <form
            className="space-y-5"
            onSubmit={handleSubmit((values) =>
              onSubmit?.(toCreatePetPayload(values)),
            )}
          >
            <FieldGroup className="grid gap-5 md:grid-cols-2">
              <Field className="md:col-span-2">
                <FieldLabel htmlFor="pet-name">Tên</FieldLabel>
                <FieldContent>
                  <Input
                    id="pet-name"
                    placeholder="Lucky"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.name)}
                    {...register("name")}
                  />
                  <FieldError errors={[errors.name]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Loài</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name="speciesId"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setValue("breedId", "");
                        }}
                        disabled={isBusy || taxonomyQuery.isPending}
                      >
                        <SelectTrigger aria-invalid={Boolean(errors.speciesId)}>
                          <SelectValue placeholder="Chọn loài" />
                        </SelectTrigger>
                        <SelectContent>
                          {speciesOptions.map((species) => (
                            <SelectItem
                              key={species.speciesId}
                              value={species.speciesId}
                            >
                              {species.nameVi || species.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.speciesId]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Giống (tùy chọn)</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name="breedId"
                    render={({ field }) => (
                      <Select
                        value={field.value || NO_BREED}
                        onValueChange={(value) =>
                          field.onChange(value === NO_BREED ? "" : value)
                        }
                        disabled={isBusy || !speciesId}
                      >
                        <SelectTrigger aria-invalid={Boolean(errors.breedId)}>
                          <SelectValue placeholder="Chọn giống" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NO_BREED}>Không rõ giống</SelectItem>
                          {breedOptions.map((breed) => (
                            <SelectItem key={breed.breedId} value={breed.breedId}>
                              {breed.nameVi || breed.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.breedId]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Giới tính</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange(value as PetGender)
                        }
                        disabled={isBusy}
                      >
                        <SelectTrigger aria-invalid={Boolean(errors.gender)}>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          {GENDERS.map((gender) => (
                            <SelectItem key={gender.value} value={gender.value}>
                              {gender.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.gender]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="pet-age">Tuổi</FieldLabel>
                <FieldContent>
                  <Input
                    id="pet-age"
                    type="number"
                    min={0}
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.age)}
                    {...register("age", { valueAsNumber: true })}
                  />
                  <FieldError errors={[errors.age]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="pet-weight">Cân nặng (kg)</FieldLabel>
                <FieldContent>
                  <Input
                    id="pet-weight"
                    type="number"
                    min={0}
                    step="0.1"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.weight)}
                    {...register("weight", { valueAsNumber: true })}
                  />
                  <FieldError errors={[errors.weight]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="pet-color">Màu sắc</FieldLabel>
                <FieldContent>
                  <Input
                    id="pet-color"
                    placeholder="Vàng / Đen..."
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.color)}
                    {...register("color")}
                  />
                  <FieldError errors={[errors.color]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Tình trạng sức khỏe</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name="healthStatus"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange(
                            value as (typeof PET_HEALTH_STATUS_VALUES)[number],
                          )
                        }
                        disabled={isBusy}
                      >
                        <SelectTrigger
                          aria-invalid={Boolean(errors.healthStatus)}
                        >
                          <SelectValue placeholder="Chọn tình trạng sức khỏe" />
                        </SelectTrigger>
                        <SelectContent>
                          {HEALTH_STATUSES.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.healthStatus]} />
                </FieldContent>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel>Trung tâm</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name="shelterId"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isBusy || organizations.length === 0}
                      >
                        <SelectTrigger aria-invalid={Boolean(errors.shelterId)}>
                          <SelectValue placeholder="Chọn trung tâm quản lý" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations.map((organization) => (
                            <SelectItem
                              key={organization.organizationId}
                              value={organization.organizationId}
                            >
                              {organization.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.shelterId]} />
                </FieldContent>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel htmlFor="pet-rescue-case">
                  Ca cứu hộ (tùy chọn)
                </FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name="rescueCaseId"
                    render={({ field }) => (
                      <RescueCaseSelect
                        id="pet-rescue-case"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isBusy}
                        invalid={Boolean(errors.rescueCaseId)}
                      />
                    )}
                  />
                  <FieldError errors={[errors.rescueCaseId]} />
                </FieldContent>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel htmlFor="pet-image">Ảnh thú cưng</FieldLabel>
                <FieldContent>
                  <Input
                    id="pet-image"
                    ref={imageInputRef}
                    type="file"
                    multiple
                    accept={ACCEPTED_PET_IMAGE_TYPES.join(",")}
                    disabled={isBusy}
                    onChange={handleImageChange}
                  />
                  <FieldError errors={[errors.imageUrls]} />
                  {uploadTempMediaMutation.isPending && (
                    <p className="text-sm text-muted-foreground">
                      Đang tải ảnh lên...
                    </p>
                  )}
                  {imageUrls && imageUrls.length > 0 ? (
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {imageUrls.map((imageUrl, index) => (
                          <div
                            key={`${imageUrl}-${index}`}
                            className="overflow-hidden rounded-md border border-input bg-muted/30"
                          >
                            <div className="relative h-40 w-full">
                              <Image
                                src={imageUrl}
                                alt={`Ảnh thú cưng ${index + 1}`}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div className="space-y-2 p-3">
                              <Button
                                type="button"
                                variant="secondary"
                                className="w-full"
                                onClick={() => removeImage(index)}
                                disabled={isBusy}
                              >
                                Xóa ảnh này
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={clearImages}
                        disabled={isBusy}
                      >
                        Xóa tất cả ảnh
                      </Button>
                    </div>
                  ) : null}
                </FieldContent>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel htmlFor="pet-description">Mô tả</FieldLabel>
                <FieldContent>
                  <textarea
                    id="pet-description"
                    placeholder="Mô tả tình trạng, tính cách..."
                    className="min-h-28 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.description)}
                    {...register("description")}
                  />
                  <FieldError errors={[errors.description]} />
                </FieldContent>
              </Field>
            </FieldGroup>

            <Separator className="my-5" />

            <FieldGroup className="grid gap-5 md:grid-cols-2">
              <Field orientation="horizontal">
                <Controller
                  control={control}
                  name="vaccinated"
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
                <FieldLabel>Đã tiêm</FieldLabel>
              </Field>

              <Field orientation="horizontal">
                <Controller
                  control={control}
                  name="neutered"
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
                <FieldLabel>Đã triệt sản</FieldLabel>
              </Field>
            </FieldGroup>

            <DialogFooter className="px-0 pb-0 pt-6">
              <Button
                variant="secondary"
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isBusy}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isBusy}>
                {uploadTempMediaMutation.isPending
                  ? "Đang tải ảnh..."
                  : submitting
                    ? "Đang tạo..."
                    : "Tạo thú cưng"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
