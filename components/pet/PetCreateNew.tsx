"use client";

import * as React from "react";

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

import type { CreatePetPayload } from "@/services/pet/pet-dto";
import type { PetGender } from "@/types/pet.type";

export type CreateNewPetValues = CreatePetPayload;

export interface CreateNewPetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitting?: boolean;
  onSubmit?: (values: CreateNewPetValues) => void;
}

const DEFAULT_VALUES: CreateNewPetValues = {
  name: "",
  species: "",
  breed: "",
  age: 0,
  gender: "UNKNOWN",
  color: "",
  weight: 0,
  description: "",
  vaccinated: false,
  neutered: false,
  rescueDate: "",
  rescueLocation: "",
  imageUrls: [],
  shelterId: "",
  rescueCaseId: "",
};

const GENDERS: Array<{ value: PetGender; label: string }> = [
  { value: "MALE", label: "Đực" },
  { value: "FEMALE", label: "Cái" },
  { value: "UNKNOWN", label: "Không rõ" },
];

export function PetCreateNew({
  open,
  onOpenChange,
  submitting,
  onSubmit,
}: CreateNewPetProps) {
  const [values, setValues] =
    React.useState<CreateNewPetValues>(DEFAULT_VALUES);

  React.useEffect(() => {
    if (!open) setValues(DEFAULT_VALUES);
  }, [open]);

  const update = React.useCallback(
    <K extends keyof CreateNewPetValues>(
      key: K,
      value: CreateNewPetValues[K],
    ) => {
      setValues((p) => ({ ...p, [key]: value }));
    },
    [],
  );

  const canSubmit = React.useMemo(() => {
    return (
      Boolean(values.name.trim()) &&
      Boolean(values.species.trim()) &&
      Boolean(values.shelterId.trim())
    );
  }, [values.name, values.shelterId, values.species]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Thêm thú cưng</DialogTitle>
          <DialogDescription>
            Nhập thông tin thú cưng. Tối thiểu cần <b>Tên</b>, <b>Loài</b>,{" "}
            <b>Shelter ID</b>.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
          <Separator className="my-4" />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Tên</Label>
              <Input
                placeholder="Lucky"
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2">
              <Label>Loài</Label>
              <Input
                placeholder="Chó / Mèo"
                value={values.species}
                onChange={(e) => update("species", e.target.value)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2">
              <Label>Giống</Label>
              <Input
                placeholder="Corgi"
                value={values.breed}
                onChange={(e) => update("breed", e.target.value)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2">
              <Label>Giới tính</Label>
              <Select
                value={values.gender}
                onValueChange={(v) => update("gender", v as PetGender)}
                disabled={Boolean(submitting)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tuổi</Label>
              <Input
                type="number"
                min={0}
                value={values.age}
                onChange={(e) => update("age", Number(e.target.value) || 0)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2">
              <Label>Cân nặng (kg)</Label>
              <Input
                type="number"
                min={0}
                step="0.1"
                value={values.weight}
                onChange={(e) => update("weight", Number(e.target.value) || 0)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2">
              <Label>Màu sắc</Label>
              <Input
                placeholder="Vàng / Đen..."
                value={values.color}
                onChange={(e) => update("color", e.target.value)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2">
              <Label>Ngày cứu hộ</Label>
              <Input
                type="date"
                value={values.rescueDate}
                onChange={(e) => update("rescueDate", e.target.value)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Địa điểm cứu hộ</Label>
              <Input
                placeholder="Q.1, TP.HCM"
                value={values.rescueLocation}
                onChange={(e) => update("rescueLocation", e.target.value)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Shelter ID</Label>
              <Input
                placeholder="shelter_123"
                value={values.shelterId}
                onChange={(e) => update("shelterId", e.target.value)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Rescue case ID (tuỳ chọn)</Label>
              <Input
                placeholder="case_123"
                value={values.rescueCaseId}
                onChange={(e) => update("rescueCaseId", e.target.value)}
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Image URLs (mỗi dòng 1 link)</Label>
              <textarea
                value={values.imageUrls.join("\n")}
                onChange={(e) =>
                  update(
                    "imageUrls",
                    e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
                placeholder="https://...\nhttps://..."
                className="min-h-24 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={Boolean(submitting)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Mô tả</Label>
              <textarea
                value={values.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Mô tả tình trạng, tính cách..."
                className="min-h-28 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={Boolean(submitting)}
              />
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={values.vaccinated}
                onChange={(e) => update("vaccinated", e.target.checked)}
                disabled={Boolean(submitting)}
              />
              <span className="text-sm">Đã tiêm</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={values.neutered}
                onChange={(e) => update("neutered", e.target.checked)}
                disabled={Boolean(submitting)}
              />
              <span className="text-sm">Đã triệt sản</span>
            </label>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6">
          <Button
            variant="secondary"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={Boolean(submitting)}
          >
            Huỷ
          </Button>
          <Button
            type="button"
            onClick={() => onSubmit?.(values)}
            disabled={Boolean(submitting) || !canSubmit}
          >
            {submitting ? "Đang tạo..." : "Tạo thú cưng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
