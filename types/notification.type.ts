/** Mirrors the backend's NotificationType. */
export type NotificationType =
  | "RESCUE_CLAIMED"
  | "RESCUE_CLAIM_RELEASED"
  | "RESCUE_CLAIM_EXPIRED"
  | "RESCUE_CLAIM_EXPIRING"
  | "RESCUE_ORGANIZATION_CLAIMED"
  | "RESCUE_CASE_ENDED"
  | "RESCUE_CASE_MOVED"
  | "RESCUE_COMPLETION_SUBMITTED"
  | "RESCUE_COMPLETION_APPROVED"
  | "RESCUE_COMPLETION_REJECTED"
  | "RESCUE_COMPLETION_NEEDS_REVIEW"
  | "RESCUE_CASE_UPDATED"
  | "RESCUE_CASE_FLAGGED"
  | "RESCUE_MATCH_SUGGESTED"
  | "RESCUE_MATCH_CONFIRMED"
  | "ADOPTION_SUBMITTED"
  | "ADOPTION_APPROVED"
  | "ADOPTION_REJECTED"
  | "ADOPTION_CANCELED"
  | "ADOPTION_COMPLETED"
  | "ADOPTION_RECLAIMED"
  | "FOLLOWUP_DUE"
  | "FOLLOWUP_REMINDER"
  | "FOLLOWUP_ALERT";

export interface AppNotification {
  notificationId: string;
  type: NotificationType;
  title: string;
  body: string;
  /** Ids of what the notification is about: caseId, applicationId, petId, completionId, token... */
  data?: Record<string, string>;
  readAt?: string | null;
  createdAt: string;
}

export interface NotificationListParams {
  unreadOnly?: boolean;
  page?: number;
  pageSize?: number;
}
