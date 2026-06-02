"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import { useUpdateRescueCase } from "@/hooks/use-rescue-case";
import type { RescueCasePayload, RescueCase } from "@/types/rescue-case.type";

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

const LocationPickerMap = dynamic(
  () => import("@/components/map/LocationPickerMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 w-full items-center justify-center rounded-lg border bg-muted/30 text-sm text-muted-foreground">
        Dang tai ban do...
      </div>
    ),
  },
);

type RescueCaseUpdateValues = Partial<RescueCasePayload>;

const PRIORITIES: Array<{
  value: NonNullable<RescueCase["priority"]>;
  label: string;
}> = [
  { value: "LOW", label: "Thap" },
  { value: "NORMAL", label: "Binh thuong" },
  { value: "HIGH", label: "Cao" },
  { value: "CRITICAL", label: "Khan cap" },
];

function mapRescueCaseToValues(rescueCase: RescueCase): RescueCaseUpdateValues {
  return {
    petId: rescueCase.petId || "",
    organizationId: rescueCase.organizationId || "",
    species: rescueCase.species || "",
    color: rescueCase.color || "",
    size: rescueCase.size || "",
    priority: rescueCase.priority || "NORMAL",
    description: rescueCase.description || "",
    latitude: rescueCase.latitude,
    longitude: rescueCase.longitude,
    locationText: rescueCase.locationText || "",
    provinceName: rescueCase.provinceName || "",
    wardName: rescueCase.wardName || "",
  };
}

interface RescueCaseUpdateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rescueCase: RescueCase;
}

export function RescueCaseUpdate({
  open,
  onOpenChange,
  rescueCase,
}: RescueCaseUpdateProps) {
  const updateRescueCaseMutation = useUpdateRescueCase();
  const [values, setValues] = React.useState<RescueCaseUpdateValues>(() =>
    mapRescueCaseToValues(rescueCase),
  );

  const isBusy = updateRescueCaseMutation.isPending;
  const handleSubmit = React.useCallback(async () => {
    await updateRescueCaseMutation.mutateAsync({
      id: rescueCase.caseId,
      payload: values,
    });
    onOpenChange(false);
  }, [onOpenChange, rescueCase.caseId, updateRescueCaseMutation, values]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Cap nhat rescue-case</DialogTitle>
          <DialogDescription>
            Chinh sua thong tin rescue-case va luu thay doi.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
          <Separator className="my-4" />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Loai</Label>
              <Input
                value={values.species ?? ""}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, species: event.target.value }))
                }
                disabled={isBusy}
              />
            </div>

            <div className="space-y-2">
              <Label>Muc do uu tien</Label>
              <Select
                value={values.priority ?? "NORMAL"}
                onValueChange={(value) =>
                  setValues((prev) => ({
                    ...prev,
                    priority: value as NonNullable<RescueCase["priority"]>,
                  }))
                }
                disabled={isBusy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chon muc do" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mau sac</Label>
              <Input
                value={values.color ?? ""}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, color: event.target.value }))
                }
                disabled={isBusy}
              />
            </div>

            <div className="space-y-2">
              <Label>Kich thuoc</Label>
              <Input
                value={values.size ?? ""}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, size: event.target.value }))
                }
                disabled={isBusy}
              />
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Dia diem</Label>
              <Input
                value={values.locationText ?? ""}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    locationText: event.target.value,
                  }))
                }
                disabled={isBusy}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Chon vi tri tren ban do</Label>
              <div className="overflow-hidden rounded-lg border">
                <LocationPickerMap
                  latitude={values.latitude}
                  longitude={values.longitude}
                  disabled={isBusy}
                  onChange={async ({ latitude, longitude }) => {
                    setValues((prev) => ({
                      ...prev,
                      latitude,
                      longitude,
                    }));
                    
                    try {
                      const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=vi`
                      );
                      const data = await res.json();
                      if (data && data.address) {
                        const addr = data.address;
                        const ward = addr.suburb || addr.quarter || addr.town || addr.village || addr.ward || "";
                        const province = addr.city || addr.state || addr.province || "";
                        
                        setValues((prev) => ({
                          ...prev,
                          latitude,
                          longitude,
                          wardName: ward,
                          provinceName: province,
                          locationText: data.display_name || prev.locationText,
                        }));
                      }
                    } catch (err) {
                      console.error("Reverse geocoding failed", err);
                    }
                  }}
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Mo ta</Label>
              <textarea
                value={values.description ?? ""}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                className="min-h-28 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isBusy}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 bg-gray-50/50 py-4 border-t rounded-b-lg">
          <Button
            variant="secondary"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isBusy}
          >
            Huy
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isBusy}>
            {isBusy ? "Dang luu..." : "Luu thay doi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
