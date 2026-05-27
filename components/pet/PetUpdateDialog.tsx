"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  createUpdatePetDefaultValues,
  toUpdatePetPayload,
  updatePetSchema,
  type UpdatePetFormInput,
  type UpdatePetFormValues,
} from "@/lib/schemas/update-pet.schema";
import type {
  Pet,
  PetGender,
  PetHealthStatus,
  PetMedia,
  PetStatus,
  PetUpdatePayload,
} from "@/types/pet.type";
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
  FieldDescription,
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

const GENDER_OPTIONS: Array<{ value: PetGender; label: string }> = [
  { value: "MALE", label: "Đực" },
  { value: "FEMALE", label: "Cái" },
  { value: "UNKNOWN", label: "Chưa rõ" },
];

const HEALTH_OPTIONS: Array<{ value: PetHealthStatus; label: string }> = [
  { value: "HEALTHY", label: "Khỏe mạnh" },
  { value: "UNDER_TREATMENT", label: "Đang điều trị" },
  { value: "RECOVERING", label: "Đang hồi phục" },
  { value: "SPECIAL_NEEDS", label: "Cần chăm sóc đặc biệt" },
];

const STATUS_OPTIONS: Array<{ value: PetStatus; label: string }> = [
  { value: "UNOWNED", label: "Chưa có chủ" },
  { value: "PENDING", label: "Đang chờ" },
  { value: "ADOPTED", label: "Đã nhận nuôi" },
  { value: "FOSTERED", label: "Đang foster" },
  { value: "UNAVAILABLE", label: "Không khả dụng" },
];

export interface PetUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pet: Pet | null;
  mediaItems?: PetMedia[];
  submitting?: boolean;
  onSubmit?: (values: Partial<PetUpdatePayload>) => void;
}

const EMPTY_VALUES: UpdatePetFormInput = {
  name: "",
  species: "",
  breed: "",
  age: 0,
  gender: "UNKNOWN",
  color: "",
  weight: 0,
  description: "",
  status: "UNOWNED",
  healthStatus: "HEALTHY",
  vaccinated: false,
  neutered: false,
  imageUrls: [],
  mediaIds: [],
};

export function PetUpdateDialog({
  open,
  onOpenChange,
  pet,
  mediaItems = [],
  submitting,
  onSubmit,
}: PetUpdateDialogProps) {
  const form = useForm<UpdatePetFormInput, unknown, UpdatePetFormValues>({
    resolver: zodResolver(updatePetSchema),
    defaultValues: EMPTY_VALUES,
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = form;

  React.useEffect(() => {
    if (!open) return;

    if (!pet) {
      reset(EMPTY_VALUES);
      return;
    }

    reset(createUpdatePetDefaultValues(pet, mediaItems));
  }, [mediaItems, open, pet, reset]);

  const isBusy = Boolean(submitting);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Cập nhật thú cưng</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin theo đúng payload cập nhật của pet.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
          <form
            className="space-y-6"
            onSubmit={handleSubmit((values) =>
              onSubmit?.(toUpdatePetPayload(values)),
            )}
          >
            <FieldGroup className="grid gap-5 md:grid-cols-2">
              <Field className="md:col-span-2">
                <FieldLabel htmlFor="update-pet-name">Tên</FieldLabel>
                <FieldContent>
                  <Input
                    id="update-pet-name"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.name)}
                    {...register("name")}
                  />
                  <FieldError errors={[errors.name]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="update-pet-species">Loài</FieldLabel>
                <FieldContent>
                  <Input
                    id="update-pet-species"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.species)}
                    {...register("species")}
                  />
                  <FieldError errors={[errors.species]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="update-pet-breed">Giống</FieldLabel>
                <FieldContent>
                  <Input
                    id="update-pet-breed"
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
                          {GENDER_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                <FieldLabel htmlFor="update-pet-age">Tuổi</FieldLabel>
                <FieldContent>
                  <Input
                    id="update-pet-age"
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
                <FieldLabel htmlFor="update-pet-weight">Cân nặng (kg)</FieldLabel>
                <FieldContent>
                  <Input
                    id="update-pet-weight"
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
                <FieldLabel htmlFor="update-pet-color">Màu sắc</FieldLabel>
                <FieldContent>
                  <Input
                    id="update-pet-color"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.color)}
                    {...register("color")}
                  />
                  <FieldError errors={[errors.color]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Trạng thái</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange(value as PetStatus)
                        }
                        disabled={isBusy}
                      >
                        <SelectTrigger aria-invalid={Boolean(errors.status)}>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.status]} />
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
                          field.onChange(value as PetHealthStatus)
                        }
                        disabled={isBusy}
                      >
                        <SelectTrigger
                          aria-invalid={Boolean(errors.healthStatus)}
                        >
                          <SelectValue placeholder="Chọn tình trạng sức khỏe" />
                        </SelectTrigger>
                        <SelectContent>
                          {HEALTH_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                <FieldLabel htmlFor="update-pet-description">Mô tả</FieldLabel>
                <FieldContent>
                  <textarea
                    id="update-pet-description"
                    className="min-h-28 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.description)}
                    {...register("description")}
                  />
                  <FieldError errors={[errors.description]} />
                </FieldContent>
              </Field>
            </FieldGroup>

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

            <Field>
              <FieldDescription>
                Ảnh và media sẽ được giữ theo hồ sơ hiện tại. Nếu cần đổi ảnh,
                hãy dùng tab thư viện media ở trang chi tiết.
              </FieldDescription>
            </Field>

            <DialogFooter className="px-0 pb-0 pt-2">
              <Button
                variant="secondary"
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isBusy}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isBusy || !pet}>
                {submitting ? "Đang cập nhật..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
