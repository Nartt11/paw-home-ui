"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  approveAdoptionDefaultValues,
  approveAdoptionSchema,
  rejectAdoptionDefaultValues,
  rejectAdoptionSchema,
  type ApproveAdoptionFormValues,
  type RejectAdoptionFormValues,
} from "@/lib/schemas/adoption-decision";
import type { AdoptionApprovePayload, AdoptionRejectPayload } from "@/types/adoption.type";

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
import { Textarea } from "@/components/ui/textarea";

type DecisionMode = "approve" | "reject";

interface AdoptionDecisionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: DecisionMode;
  submitting?: boolean;
  applicantName?: string;
  petName?: string;
  onSubmit: (
    payload: AdoptionApprovePayload | AdoptionRejectPayload,
  ) => Promise<void> | void;
}

export function AdoptionDecisionDialog({
  open,
  onOpenChange,
  mode,
  submitting = false,
  applicantName,
  petName,
  onSubmit,
}: AdoptionDecisionDialogProps) {
  const isReject = mode === "reject";
  const form = useForm<
    ApproveAdoptionFormValues | RejectAdoptionFormValues
  >({
    resolver: zodResolver(
      isReject ? rejectAdoptionSchema : approveAdoptionSchema,
    ),
    defaultValues: isReject
      ? rejectAdoptionDefaultValues
      : approveAdoptionDefaultValues,
  });

  React.useEffect(() => {
    if (!open) {
      form.reset(
        isReject ? rejectAdoptionDefaultValues : approveAdoptionDefaultValues,
      );
      return;
    }

    form.reset(
      isReject ? rejectAdoptionDefaultValues : approveAdoptionDefaultValues,
    );
  }, [form, isReject, open]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      note: values.note ?? "",
      rejectReason: values.rejectReason ?? "",
      readyAt: values.readyAt ?? "",
    });
  });

  const title = isReject ? "Tu choi don nhan nuoi" : "Duyet don nhan nuoi";
  const description = applicantName || petName
    ? `${applicantName || "Nguoi nop don"} -> ${petName || "Thu cung"}`
    : "Xu ly don nhan nuoi hien tai.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`${mode}-note`}>Ghi chu</Label>
            <Textarea
              id={`${mode}-note`}
              rows={4}
              placeholder="Nhap ghi chu xu ly..."
              disabled={submitting}
              {...form.register("note")}
            />
            {form.formState.errors.note ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.note.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-ready-at`}>
              Ngay san sang ban giao
            </Label>
            <Input
              id={`${mode}-ready-at`}
              type="datetime-local"
              disabled={submitting}
              {...form.register("readyAt")}
            />
            {form.formState.errors.readyAt ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.readyAt.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-reject-reason`}>
              {isReject ? "Ly do tu choi" : "Ghi chu bo sung"}
            </Label>
            <Textarea
              id={`${mode}-reject-reason`}
              rows={4}
              placeholder={
                isReject
                  ? "Nhap ly do tu choi don..."
                  : "Neu can, ban co the de lai ghi chu bo sung."
              }
              disabled={submitting}
              {...form.register("rejectReason")}
            />
            {form.formState.errors.rejectReason ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.rejectReason.message}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Huy
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Dang xu ly..."
                : isReject
                  ? "Xac nhan tu choi"
                  : "Xac nhan duyet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
