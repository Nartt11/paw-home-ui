"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRescueCases } from "@/hooks/use-rescue-case";

const NO_RESCUE_CASE = "none";
const RESCUE_CASE_PARAMS = { page: 0, pageSize: 100 };

export interface RescueCaseSelectProps {
  id?: string;
  value: string;
  disabled?: boolean;
  invalid?: boolean;
  onChange: (caseId: string) => void;
}

export function RescueCaseSelect({
  id,
  value,
  disabled,
  invalid,
  onChange,
}: RescueCaseSelectProps) {
  const rescueCasesQuery = useRescueCases(RESCUE_CASE_PARAMS);

  return (
    <Select
      value={value || NO_RESCUE_CASE}
      onValueChange={(next) => onChange(next === NO_RESCUE_CASE ? "" : next)}
      disabled={disabled || rescueCasesQuery.isPending}
    >
      <SelectTrigger id={id} aria-invalid={invalid} className="w-full">
        <SelectValue placeholder="Chọn ca cứu hộ" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NO_RESCUE_CASE}>Không liên kết ca cứu hộ</SelectItem>
        {(rescueCasesQuery.data?.content ?? []).map((rescueCase) => (
          <SelectItem key={rescueCase.caseId} value={rescueCase.caseId}>
            {[rescueCase.caseCode, rescueCase.species]
              .filter(Boolean)
              .join(" · ") || rescueCase.caseId}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
