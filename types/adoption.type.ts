import { baseEntity } from "./core.type";

export interface AdoptionApplication extends baseEntity {
  application_id: string;

  pet_id?: string;
  applicant_id?: string;
  organization_id?: string;

  status?: "PENDING" | "APPROVED" | "REJECTED";

  note?: string;
  experience?: string;
  live_condition?: string;

  decided_at?: Date;
  decided_by?: string;
}
