import { AdoptionSummary } from "@/types/adoption.type";
import AdoptionRequestCard from "./AdoptionRequestCard";

export interface Props {
  adoptionsList: AdoptionSummary[];
  onViewDetail?: (applicationId: string) => void;
  onApprove?: (applicationId: string) => void;
  onReject?: (applicationId: string) => void;
}

export default function AdoptionRequestList({
  adoptionsList,
  onViewDetail,
  onApprove,
  onReject,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {adoptionsList.map((adoption) => (
        <AdoptionRequestCard
          key={adoption.applicationId}
          adoption={adoption}
          onViewDetail={onViewDetail}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </div>
  );
}
