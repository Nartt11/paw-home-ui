"use client";

import * as React from "react";
import Image from "next/image";
import { Loader2, CheckCircle2, AlertTriangle, Calendar, MapPin, User, FileText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useRescueCaseDetail, useRescueCompletionDetail, useApproveRescueCompletion } from "@/hooks/use-rescue-case";

interface RescueCompletionCompareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string | null;
  onSuccess?: () => void;
}

export function RescueCompletionCompareDialog({
  open,
  onOpenChange,
  caseId,
  onSuccess,
}: RescueCompletionCompareDialogProps) {
  const caseQuery = useRescueCaseDetail(caseId ?? undefined);
  const completionQuery = useRescueCompletionDetail(caseId ?? undefined);
  const approveMutation = useApproveRescueCompletion();

  const isPending = caseQuery.isPending || completionQuery.isPending;
  const isBusy = approveMutation.isPending;

  const handleApprove = async () => {
    if (!caseId) return;
    try {
      await approveMutation.mutateAsync(caseId);
      toast.success("Duyệt hoàn thành ca cứu hộ thành công!");
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra khi duyệt.");
    }
  };

  const rescueCase = caseQuery.data;
  const completion = completionQuery.data;

  return (
    <Dialog open={open} onOpenChange={(val) => !isBusy && onOpenChange(val)}>
      <DialogContent className="w-full p-0 sm:max-w-5xl bg-white">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>So sánh & Duyệt hoàn thành cứu hộ</DialogTitle>
          <DialogDescription>
            Đối chiếu thông tin báo cáo ban đầu và thực tế cứu hộ thành công trước khi phê duyệt.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
          <Separator className="my-4" />

          {isPending ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !rescueCase || !completion ? (
            <div className="flex h-60 flex-col items-center justify-center text-muted-foreground gap-2">
              <AlertTriangle className="h-10 w-10 text-amber-500" />
              <p>Không tìm thấy dữ liệu đối chiếu.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {/* LEFT: ORIGINAL REPORT */}
              <div className="space-y-4 rounded-xl border p-4 bg-muted/10">
                <h3 className="text-base font-semibold text-rose-600 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                  Báo cáo ca cứu hộ ban đầu
                </h3>
                <Separator />
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground block">Loài</span>
                      <span className="font-medium text-foreground">{rescueCase.species || "—"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Mức độ ưu tiên</span>
                      <span className="font-medium text-foreground">{rescueCase.priority || "—"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Màu sắc</span>
                      <span className="font-medium text-foreground">{rescueCase.color || "—"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Kích thước</span>
                      <span className="font-medium text-foreground">{rescueCase.size || "—"}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground block flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Địa điểm báo cáo
                    </span>
                    <span className="text-sm font-medium text-foreground block mt-0.5">
                      {rescueCase.locationText || "—"}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground block flex items-center gap-1">
                      <FileText className="h-3 w-3" /> Mô tả tình trạng
                    </span>
                    <p className="text-sm text-foreground bg-white border rounded-md p-2 mt-1 whitespace-pre-wrap min-h-[4.5rem]">
                      {rescueCase.description || "—"}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Ảnh hiện trường ban đầu</span>
                    {rescueCase.imageUrls && rescueCase.imageUrls.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {rescueCase.imageUrls.map((url, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                            <Image src={url} alt={`Report original ${idx}`} fill className="object-cover" unoptimized />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">Không có ảnh đi kèm</span>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: COMPLETION REPORT */}
              <div className="space-y-4 rounded-xl border p-4 bg-emerald-50/10 border-emerald-100">
                <h3 className="text-base font-semibold text-emerald-600 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Báo cáo hoàn thành cứu hộ
                </h3>
                <Separator className="bg-emerald-100/60" />

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground block flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Thời gian cứu thành công
                      </span>
                      <span className="font-medium text-foreground block mt-0.5">
                        {new Date(completion.rescuedAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block flex items-center gap-1">
                        <User className="h-3 w-3" /> Người xác nhận
                      </span>
                      <span className="font-medium text-foreground block mt-0.5">
                        {completion.verifiedByName || "—"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground block flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Địa điểm bàn giao/tiếp nhận
                    </span>
                    <span className="text-sm font-medium text-foreground block mt-0.5">
                      {completion.locationNote || "—"}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground block flex items-center gap-1">
                      <FileText className="h-3 w-3" /> Ghi chú quá trình cứu hộ
                    </span>
                    <p className="text-sm text-foreground bg-white border border-emerald-100 rounded-md p-2 mt-1 whitespace-pre-wrap min-h-[4.5rem]">
                      {completion.rescueNote || "—"}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Ảnh xác thực hoàn thành</span>
                    {completion.verificationImagesUrl && completion.verificationImagesUrl.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {completion.verificationImagesUrl.map((url, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-emerald-100">
                            <Image src={url} alt={`Verification ${idx}`} fill className="object-cover" unoptimized />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">Không có ảnh xác thực</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 pb-6 bg-gray-50/50 py-4 border-t rounded-b-lg">
          <Button
            variant="secondary"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isBusy}
            className="rounded-xl font-semibold"
          >
            Hủy
          </Button>
          {!isPending && rescueCase && completion && (
            <Button
              type="button"
              onClick={handleApprove}
              disabled={isBusy}
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer font-semibold rounded-xl"
            >
              {isBusy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang duyệt...
                </>
              ) : (
                "Phê duyệt hoàn thành"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
