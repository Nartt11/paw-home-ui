import type {
  AdoptionOutcomeType,
  FollowupAlertResolution,
  FollowupAlertStatus,
  FollowupMilestone,
  FollowupSeverity,
  ReturnReasonCode,
} from "@/types/followup.type";

export const FOLLOWUP_MILESTONE_LABEL: Record<FollowupMilestone, string> = {
  DAY_2: "Ngày 2",
  WEEK_2: "Tuần 2",
  MONTH_3: "Tháng 3",
  MONTH_6: "Tháng 6",
};

export const FOLLOWUP_SEVERITY_LABEL: Record<FollowupSeverity, string> = {
  RED: "Khẩn",
  YELLOW: "Cần theo dõi",
  GREEN: "Ổn",
};

export const FOLLOWUP_SEVERITY_BADGE: Record<FollowupSeverity, string> = {
  RED: "border-red-200 bg-red-50 text-red-800",
  YELLOW: "border-amber-200 bg-amber-50 text-amber-800",
  GREEN: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export const FOLLOWUP_ALERT_STATUS_LABEL: Record<FollowupAlertStatus, string> = {
  OPEN: "Chưa ai nhận",
  IN_PROGRESS: "Đang xử lý",
  RESOLVED: "Đã xong",
};

export const FOLLOWUP_RESOLUTION_LABEL: Record<FollowupAlertResolution, string> = {
  ADVISED: "Đã tư vấn",
  VISITED: "Đã đến thăm",
  RETURNED: "Đã nhận bé về",
  NO_ACTION_NEEDED: "Không cần làm gì",
  UNREACHABLE: "Không liên lạc được",
  OTHER: "Khác",
};

/** Why an adopter can no longer keep the pet, in the adopter's words. */
export const RETURN_REASON_LABEL: Record<ReturnReasonCode, string> = {
  BEHAVIOR: "Bé có vấn đề hành vi",
  PET_CONFLICT: "Không hợp với thú khác trong nhà",
  CHILDREN: "Không hợp với trẻ nhỏ",
  HOUSING_MOVING: "Chuyển nhà, nhà không cho nuôi",
  ALLERGY: "Người nhà bị dị ứng",
  FINANCIAL: "Không đủ chi phí",
  HEALTH_OWNER: "Sức khoẻ của tôi",
  TIME: "Không đủ thời gian",
  HEALTH_PET: "Bé bệnh, tôi không chăm được",
  OTHER: "Lý do khác",
};

export const ADOPTION_OUTCOME_LABEL: Record<AdoptionOutcomeType, string> = {
  RETURNED_BY_ADOPTER: "Người nhận trả bé về",
  REHOMED: "Bé đã có nhà mới",
  LOST: "Bé bị lạc",
  DECEASED: "Bé đã mất",
};

/** What the reasons on an alert mean; the backend sends short codes. */
export function followupReasonLabel(reason: string) {
  const map: Record<string, string> = {
    PET_GONE: "Không còn nuôi bé",
    CONSIDERING_RETURN: "Đang tính trả bé",
    BITE_INJURY: "Bé cắn gây thương tích",
    BITE_NO_INJURY: "Bé cắn, không bị thương",
    PET_HEALTH: "Bé có dấu hiệu sức khoẻ đáng lo",
    PET_HEALTH_WORRIED: "Người nhận đang lo về sức khoẻ bé",
    BEHAVIOR: "Bé sợ hãi hoặc khó thích nghi",
    SUPPORT_REQUESTED: "Người nhận xin tư vấn",
    RETURN_REQUESTED: "Người nhận muốn trả bé",
    NO_RESPONSE: "Không trả lời hỏi thăm",
  };
  return map[reason] ?? RETURN_REASON_LABEL[reason as ReturnReasonCode] ?? reason;
}
