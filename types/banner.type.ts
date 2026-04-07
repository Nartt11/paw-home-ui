import { baseEntity } from "./core.type";

export interface Banner extends baseEntity {
  banner_id: string;

  title?: string;
  subtitle?: string;

  media_id?: string;

  link_url?: string;
  link_type?: "NONE" | "INTERNAL" | "EXTERNAL";

  display_order: number;

  start_date?: Date;
  end_date?: Date;

  is_active: boolean;
  target_page?: string;
}
