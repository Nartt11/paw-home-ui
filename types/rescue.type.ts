import { baseEntity } from "./core.type";

export interface RescueCase extends baseEntity {
  case_id: string;

  reported_by?: string;
  organization_id?: string;
  pet_id?: string;

  species?: string;
  color?: string;
  size?: string;

  priority?: "LOW" | "NORMAL" | "HIGH";
  description?: string;

  location?: string;
  location_text?: string;

  province_code?: string;
  province_name?: string;

  ward_code?: string;
  ward_name?: string;

  status?: "OPEN" | "IN_PROGRESS" | "RESOLVED";

  reported_at?: Date;
  resolved_at?: Date;
}

export interface RescueMedia {
  case_id: string;
  media_id: string;
}
