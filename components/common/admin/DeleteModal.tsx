"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: React.ReactNode;
  warningText?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  confirmDisabled?: boolean;
  confirming?: boolean;
  onConfirm: () => void;
}

export function DeleteModal({
  open,
  onOpenChange,
  title = "Xác nhận xoá",
  description = "Bạn có chắc chắn muốn xoá mục này? Hành động này không thể hoàn tác.",
  warningText,
  cancelText = "Huỷ",
  confirmText = "Xoá",
  confirmDisabled,
  confirming,
  onConfirm,
}: DeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive">
              <Trash2 className="h-4 w-4" />
            </span>
            {title}
          </DialogTitle>
          <DialogDescription className="mt-2">{description}</DialogDescription>
          {warningText ? (
            <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
              {warningText}
            </div>
          ) : null}
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={Boolean(confirmDisabled) || Boolean(confirming)}
            onClick={onConfirm}
          >
            {confirming ? "Đang xoá..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
