export interface DashboardPeriodParams {
  month: number;
  year: number;
}

export type DashboardTrend = "up" | "down" | "neutral";

export interface KpiItem {
  value: number;
  changePercent: number;
  trend: DashboardTrend;
}

export interface SystemKpis {
  totalOrganizations: KpiItem;
  pendingOrganizations: KpiItem;
  totalPets: KpiItem;
  openRescueCases: KpiItem;
  pendingAdoptions: KpiItem;
  completedAdoptions: KpiItem;
}

export interface SystemDashboardOverview {
  period: DashboardPeriodParams;
  kpis: SystemKpis;
}

export interface AdoptionTrendItem {
  month: number;
  label: string;
  pending: number;
  approved: number;
  rejected: number;
  completed: number;
}

export interface AdoptionTrend {
  year: number;
  chartType: string;
  items: AdoptionTrendItem[];
}

export interface StatusSummaryItem {
  status: string;
  label: string;
  count: number;
}

export interface PrioritySummaryItem {
  priority: string;
  label: string;
  count: number;
}

export interface RescueSummary {
  period: DashboardPeriodParams;
  byStatus: StatusSummaryItem[];
  byPriority: PrioritySummaryItem[];
}

export interface TopOrganizationItem {
  organizationId: string;
  organizationName: string;
  status: string;
  totalPets: number;
  openRescueCases: number;
  pendingAdoptions: number;
  completedAdoptions: number;
  healthAlerts: number;
}

export interface TopOrganizations {
  items: TopOrganizationItem[];
}

export interface PendingTaskItem {
  taskId: string;
  type: string;
  title: string;
  referenceId: string;
  status: string;
  priority: string;
  createdAt: string;
  actionUrl: string;
}

export interface PendingTasks {
  items: PendingTaskItem[];
}
