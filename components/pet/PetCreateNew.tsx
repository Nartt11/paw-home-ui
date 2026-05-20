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
import {
  ACCEPTED_PET_IMAGE_TYPES,
  createPetDefaultValues,
  createPetSchema,
  type CreatePetFormValues,
  MAX_PET_IMAGE_SIZE,
} from "@/lib/schemas/create-pet.schema";
import cloudinaryService from "@/services/media/cloudinary";
import type { PetGender } from "@/types/pet.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

export type CreateNewPetValues = CreatePetFormValues;

export interface CreateNewPetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitting?: boolean;
  onSubmit?: (values: CreateNewPetValues) => void;
}

const GENDERS: Array<{ value: PetGender; label: string }> = [
  { value: "MALE", label: "Đực" },
  { value: "FEMALE", label: "Cái" },
  { value: "UNKNOWN", label: "Không rõ" },
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
  onSubmit,
}: CreateNewPetProps) {
  const imageInputRef = React.useRef<HTMLInputElement | null>(null);

 const form = useForm({
   resolver: zodResolver(createPetSchema),
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

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const uploads = await Promise.all(
        files.map((file) => cloudinaryService.uploadPetTempImage(file)),
      );

      return uploads.map((upload) => upload.secure_url);
    },
    onSuccess: (uploadedUrls) => {
      const nextImageUrls = [...(imageUrls ?? []), ...uploadedUrls];

      setValue("imageUrls", nextImageUrls, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      toast.success(`Tải lên thành công ${uploadedUrls.length} ảnh`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Không thể tải ảnh lên",
      );
    },
  });

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

      await uploadMutation.mutateAsync(files);
      event.target.value = "";
    },
    [uploadMutation],
  );

  const removeImage = React.useCallback(
    (index: number) => {
      const nextImageUrls = imageUrls.filter((_, currentIndex) => currentIndex !== index);

      setValue("imageUrls", nextImageUrls, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      if (nextImageUrls.length === 0 && imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    },
    [imageUrls, setValue],
  );

  const clearImages = React.useCallback(() => {
    setValue("imageUrls", [], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }, [setValue]);

  const isBusy = Boolean(submitting) || uploadMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Thêm thú cưng</DialogTitle>
          <DialogDescription>Nhập thông tin thú cưng.</DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
          <Separator className="my-4" />

          <form
            className="space-y-5"
            onSubmit={handleSubmit((values) => onSubmit?.(values))}
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
                <FieldLabel htmlFor="pet-species">Loài</FieldLabel>
                <FieldContent>
                  <Input
                    id="pet-species"
                    placeholder="Chó / Mèo"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.species)}
                    {...register("species")}
                  />
                  <FieldError errors={[errors.species]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="pet-breed">Giống</FieldLabel>
                <FieldContent>
                  <Input
                    id="pet-breed"
                    placeholder="Corgi"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.breed)}
                    {...register("breed")}
                  />
                  <FieldError errors={[errors.breed]} />
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
                <FieldLabel htmlFor="pet-rescue-date">Ngày cứu hộ</FieldLabel>
                <FieldContent>
                  <Input
                    id="pet-rescue-date"
                    type="date"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.rescueDate)}
                    {...register("rescueDate")}
                  />
                  <FieldError errors={[errors.rescueDate]} />
                </FieldContent>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel htmlFor="pet-rescue-location">
                  Địa điểm cứu hộ
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="pet-rescue-location"
                    placeholder="Q.1, TP.HCM"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.rescueLocation)}
                    {...register("rescueLocation")}
                  />
                  <FieldError errors={[errors.rescueLocation]} />
                </FieldContent>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel htmlFor="pet-shelter-id">Shelter ID</FieldLabel>
                <FieldContent>
                  <Input
                    id="pet-shelter-id"
                    placeholder="shelter_123"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.shelterId)}
                    {...register("shelterId")}
                  />
                  <FieldError errors={[errors.shelterId]} />
                </FieldContent>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel htmlFor="pet-rescue-case-id">
                  Rescue case ID (tuỳ chọn)
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="pet-rescue-case-id"
                    placeholder="case_123"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.rescueCaseId)}
                    {...register("rescueCaseId")}
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
                  {uploadMutation.isPending && (
                    <p className="text-sm text-muted-foreground">
                      Đang tải ảnh lên Cloudinary...
                    </p>
                  )}
                  {imageUrls && imageUrls?.length > 0 ? (
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
                              <Input value={imageUrl} readOnly disabled />
                              <Button
                                type="button"
                                variant="secondary"
                                className="w-full"
                                onClick={() => removeImage(index)}
                                disabled={isBusy}
                              >
                                Xoá ảnh này
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
                        Xoá tất cả ảnh
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
                Huỷ
              </Button>
              <Button type="submit" disabled={isBusy}>
                {uploadMutation.isPending
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
