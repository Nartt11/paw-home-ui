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

export interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  deleting?: boolean;
  onConfirm: () => void;
}

export default function DeleteModal({
  open,
  onOpenChange,
  title = "Xác nhận xoá",
  description = "Bạn có chắc muốn xoá mục này không?",
  deleting,
  onConfirm,
}: DeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={Boolean(deleting)}
          >
            Huỷ
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={Boolean(deleting)}
          >
            {deleting ? "Đang xoá..." : "Xoá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
