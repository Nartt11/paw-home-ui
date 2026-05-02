export interface AuditLog {
  log_id: string;

  entity_type: string;
  entity_id: string;

  action: string;

  actor_id?: string;

  old_value?: Record<string, AuditLog>;
  new_value?: Record<string, AuditLog>;

  ip_address?: string;
  created_at: Date;
}
