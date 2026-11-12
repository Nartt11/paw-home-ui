"use client";

import { RescueCaseViewDetail } from "@/components/rescue-case/RescueCaseViewDetail";
import { useRescueCaseDetail } from "@/hooks/use-rescue-case";

export interface RescueCaseDialogProps {
  /** The case to show; null keeps the dialog closed. */
  caseId: string | null;
  onClose: () => void;
}

/**
 * Opens a rescue case on its own, on top of the feed, with the same detail view the map uses.
 * A post only points to its case; this is where the case itself is read.
 */
export function RescueCaseDialog({ caseId, onClose }: RescueCaseDialogProps) {
  const detailQuery = useRescueCaseDetail(caseId ?? undefined);

  return (
    <RescueCaseViewDetail
      open={!!caseId}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      rescueCase={caseId ? (detailQuery.data ?? null) : null}
    />
  );
}
