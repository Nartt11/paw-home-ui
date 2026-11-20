/** Check-ins after an adoption is completed: day 2, week 2, month 3, month 6. */
export type FollowupMilestone = "DAY_2" | "WEEK_2" | "MONTH_3" | "MONTH_6";
/** GREEN: all fine. YELLOW: the organization should follow up. RED: urgent. */
export type FollowupSeverity = "GREEN" | "YELLOW" | "RED";

export interface FollowupFormOption {
  value: string;
  label: string;
}

export interface FollowupFormQuestion {
  key: string;
  text: string;
  options: FollowupFormOption[];
}

/** The check-in form behind a link sent by email; no sign-in needed. */
export interface FollowupForm {
  petName: string;
  milestone: FollowupMilestone;
  intro: string;
  questions: FollowupFormQuestion[];
}

export interface FollowupAnswers {
  stillHasPet?: boolean;
  wellbeing?: "NORMAL" | "WORRIED" | "ALARMING";
  fear?: "NONE" | "SOME" | "MUCH";
  incident?: "NONE" | "NO_INJURY" | "INJURY";
  support?: "NONE" | "ADVICE" | "CONSIDERING_RETURN";
  note?: string;
}

/** One milestone in an adoption's follow-up timeline. */
export interface Followup {
  followupId: string;
  milestone: FollowupMilestone;
  status: string;
  dueAt: string;
  sentAt?: string;
  respondedAt?: string;
  expiresAt?: string;
  severity?: FollowupSeverity;
  stillHasPet?: boolean;
}

export type FollowupAlertStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";
export type FollowupAlertResolution =
  | "ADVISED"
  | "VISITED"
  | "RETURNED"
  | "NO_ACTION_NEEDED"
  | "UNREACHABLE"
  | "OTHER";

/** Work for an organization after an adoption: a worrying answer, a support or return request. */
export interface FollowupAlert {
  alertId: string;
  applicationId: string;
  petId: string;
  petName: string;
  severity: FollowupSeverity;
  reasons: string[];
  status: FollowupAlertStatus;
  assignedTo?: string;
  createdAt: string;
  firstActionAt?: string;
  resolvedAt?: string;
  resolution?: FollowupAlertResolution;
  note?: string;
}

/** Why an adopter can no longer keep the pet. Returning never costs reputation. */
export type ReturnReasonCode =
  | "BEHAVIOR"
  | "PET_CONFLICT"
  | "CHILDREN"
  | "HOUSING_MOVING"
  | "ALLERGY"
  | "FINANCIAL"
  | "HEALTH_OWNER"
  | "TIME"
  | "HEALTH_PET"
  | "OTHER";

export type AdoptionOutcomeType = "RETURNED_BY_ADOPTER" | "REHOMED" | "LOST" | "DECEASED";
