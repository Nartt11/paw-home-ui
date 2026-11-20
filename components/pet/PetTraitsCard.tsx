"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Brain, Pencil } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePetTraits, useSavePetTraits } from "@/hooks/use-pet";
import {
  PET_SCALE_FIELDS,
  petTraitsSchema,
  toPetTraitsPayload,
  toPetTraitsValues,
  type PetTraitsValues,
} from "@/lib/schemas/pet-traits";

const NONE = "__none";

const ENUM_FIELDS = [
  {
    name: "size",
    label: "Kích cỡ",
    options: { SMALL: "Nhỏ", MEDIUM: "Vừa", LARGE: "Lớn" },
  },
  {
    name: "careLevel",
    label: "Mức chăm sóc",
    options: { LOW: "Thấp", MEDIUM: "Vừa", HIGH: "Cao" },
  },
  {
    name: "biteHistory",
    label: "Tiền sử cắn",
    options: { NONE: "Chưa từng", MINOR: "Nhẹ", INJURY: "Gây thương tích" },
  },
  {
    name: "sourceRole",
    label: "Nguồn thông tin",
    options: {
      FOSTER: "Người nuôi tạm",
      STAFF: "Nhân viên trạm",
      PREVIOUS_OWNER: "Chủ cũ",
      OWNER: "Chủ hiện tại",
    },
  },
] as const;


/** Behaviour and needs that the adoption match is computed from. */
export function PetTraitsCard({ petId, canEdit }: { petId: string; canEdit: boolean }) {
  const traitsQuery = usePetTraits(petId);
  const saveTraits = useSavePetTraits(petId);
  const [open, setOpen] = React.useState(false);

  const form = useForm<PetTraitsValues>({
    resolver: zodResolver(petTraitsSchema),
    values: toPetTraitsValues(traitsQuery.data),
  });
  const { errors } = form.formState;

  const submit = form.handleSubmit(async (values) => {
    try {
      await saveTraits.mutateAsync(toPetTraitsPayload(values));
      toast.success("Đã lưu đặc điểm thú cưng");
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không lưu được");
    }
  });

  const t = traitsQuery.data;
  const recorded = PET_SCALE_FIELDS.filter(([key]) => t?.[key] != null);

  return (
    <Card className="border-none shadow-xl shadow-primary/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-xl font-serif font-bold">
          <Brain className="h-5 w-5 text-primary" />
          Đặc điểm & tính cách
        </CardTitle>
        {canEdit && (
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            <Pencil className="mr-1 size-4" /> Cập nhật
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-8 pb-8 pt-0 text-sm">
        {traitsQuery.isPending ? (
          <p className="text-muted-foreground">Đang tải...</p>
        ) : recorded.length === 0 ? (
          <p className="italic text-muted-foreground">
            Chưa ghi nhận đặc điểm. Hệ thống cần dữ liệu này để tính độ phù hợp khi duyệt đơn.
          </p>
        ) : (
          <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {recorded.map(([key, label]) => (
              <div key={key} className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium">{t?.[key]}/5</dd>
              </div>
            ))}
          </dl>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Đặc điểm & tính cách</DialogTitle>
            <DialogDescription>
              Thang 1–5 (1 = rất thấp, 5 = rất cao). Để trống nếu chưa biết.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
            <div className="grid gap-3 sm:grid-cols-3">
              {PET_SCALE_FIELDS.map(([key, label]) => (
                <Field key={key}>
                  <FieldLabel htmlFor={`trait-${key}`}>{label}</FieldLabel>
                  <FieldContent>
                    <Input
                      id={`trait-${key}`}
                      type="number"
                      min={1}
                      max={5}
                      {...form.register(key)}
                    />
                    <FieldError errors={[errors[key]]} />
                  </FieldContent>
                </Field>
              ))}
              <Field>
                <FieldLabel htmlFor="trait-alone">Ở một mình được (phút)</FieldLabel>
                <FieldContent>
                  <Input id="trait-alone" type="number" min={0} max={1440} {...form.register("aloneMinutes")} />
                  <FieldError errors={[errors.aloneMinutes]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="trait-cost">Chi phí/tháng (VNĐ)</FieldLabel>
                <FieldContent>
                  <Input id="trait-cost" type="number" min={0} {...form.register("monthlyCost")} />
                  <FieldError errors={[errors.monthlyCost]} />
                </FieldContent>
              </Field>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {ENUM_FIELDS.map(({ name, label, options }) => (
                <Field key={name}>
                  <FieldLabel>{label}</FieldLabel>
                  <FieldContent>
                    <Controller
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <Select
                          value={field.value || NONE}
                          onValueChange={(v) => field.onChange(v === NONE ? "" : v)}
                        >
                          <SelectTrigger aria-label={label}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {name !== "sourceRole" && (
                              <SelectItem value={NONE}>Chưa rõ</SelectItem>
                            )}
                            {Object.entries(options).map(([value, text]) => (
                              <SelectItem key={value} value={value}>
                                {text}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FieldContent>
                </Field>
              ))}
            </div>

            <Controller
              control={form.control}
              name="biteVerified"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={field.value} onCheckedChange={(c) => field.onChange(c === true)} />
                  Nhân viên đã xác minh tiền sử cắn
                </label>
              )}
            />

            <Field>
              <FieldLabel htmlFor="trait-note">Ghi chú quản lý</FieldLabel>
              <FieldContent>
                <Textarea
                  id="trait-note"
                  rows={3}
                  placeholder="VD: giữ đồ ăn, cần làm quen dần"
                  {...form.register("note")}
                />
                <FieldError errors={[errors.note]} />
              </FieldContent>
            </Field>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={saveTraits.isPending}>
                {saveTraits.isPending ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
