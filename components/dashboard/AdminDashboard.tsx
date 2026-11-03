"use client";

import * as React from "react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SYSTEM_ROLES } from "@/constants/roles";
import {
  useDashboardAdoptionTrend,
  useDashboardOverview,
  useDashboardPendingTasks,
  useDashboardRescueSummary,
  useDashboardTopOrganizations,
} from "@/hooks/use-admin";
import { useCurrentUser } from "@/hooks/use-current-user";
import type {
  AdoptionTrendItem,
  KpiItem,
  SystemKpis,
} from "@/types/dashboard.type";

const YEARS_BACK = 5;
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

const KPI_LABELS: Array<{ key: keyof SystemKpis; label: string }> = [
  { key: "totalOrganizations", label: "Trung tâm" },
  { key: "pendingOrganizations", label: "Trung tâm chờ duyệt" },
  { key: "totalPets", label: "Thú cưng" },
  { key: "openRescueCases", label: "Ca cứu hộ đang mở" },
  { key: "pendingAdoptions", label: "Đơn nhận nuôi chờ duyệt" },
  { key: "completedAdoptions", label: "Nhận nuôi hoàn tất" },
];

const ADOPTION_SERIES = ["pending", "approved", "rejected", "completed"] as const;

// Bảng màu đã kiểm tra bằng validate_palette ở cả hai chế độ sáng và tối
const adoptionChartConfig = {
  pending: {
    label: "Chờ duyệt",
    theme: { light: "#2a78d6", dark: "#3987e5" },
  },
  approved: {
    label: "Đã duyệt",
    theme: { light: "#eb6834", dark: "#d95926" },
  },
  rejected: {
    label: "Từ chối",
    theme: { light: "#1baf7a", dark: "#199e70" },
  },
  completed: {
    label: "Hoàn tất",
    theme: { light: "#eda100", dark: "#c98500" },
  },
} satisfies ChartConfig;

function SectionMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="py-8 text-center text-sm text-muted-foreground">{children}</p>
  );
}

function KpiCard({
  label,
  item,
  loading,
}: {
  label: string;
  item?: KpiItem;
  loading: boolean;
}) {
  const TrendIcon =
    item?.trend === "up"
      ? TrendingUpIcon
      : item?.trend === "down"
        ? TrendingDownIcon
        : MinusIcon;

  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {item?.value.toLocaleString("vi-VN") ?? "—"}
          </CardTitle>
        )}
      </CardHeader>
      {item ? (
        <CardContent className="flex items-center gap-1 text-xs text-muted-foreground">
          <TrendIcon className="size-3.5" />
          {item.changePercent.toLocaleString("vi-VN", {
            maximumFractionDigits: 1,
          })}
          % so với tháng trước
        </CardContent>
      ) : null}
    </Card>
  );
}

function AdoptionTrendChart({ items }: { items: AdoptionTrendItem[] }) {
  return (
    <>
      <ChartContainer
        config={adoptionChartConfig}
        className="aspect-auto h-72 w-full"
      >
        <BarChart accessibilityLayer data={items}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
          {ADOPTION_SERIES.map((series, index) => (
            <Bar
              key={series}
              dataKey={series}
              stackId="adoptions"
              fill={`var(--color-${series})`}
              stroke="var(--card)"
              strokeWidth={2}
              radius={
                index === ADOPTION_SERIES.length - 1 ? [4, 4, 0, 0] : undefined
              }
            />
          ))}
        </BarChart>
      </ChartContainer>

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-muted-foreground">
          Xem bảng số liệu
        </summary>
        <Table className="mt-2">
          <TableHeader>
            <TableRow>
              <TableHead>Tháng</TableHead>
              {ADOPTION_SERIES.map((series) => (
                <TableHead key={series} className="text-right">
                  {adoptionChartConfig[series].label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.month}>
                <TableCell>{item.label}</TableCell>
                {ADOPTION_SERIES.map((series) => (
                  <TableCell key={series} className="text-right tabular-nums">
                    {item[series]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </details>
    </>
  );
}

function CountList({
  title,
  items,
}: {
  title: string;
  items: Array<{ key: string; label: string; count: number }>;
}) {
  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">{title}</h3>
      {items.map((item) => (
        <div key={item.key} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium tabular-nums">{item.count}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminDashboard() {
  const now = React.useMemo(() => new Date(), []);
  const [month, setMonth] = React.useState(now.getMonth() + 1);
  const [year, setYear] = React.useState(now.getFullYear());
  const period = React.useMemo(() => ({ month, year }), [month, year]);
  const years = Array.from(
    { length: YEARS_BACK },
    (_, index) => now.getFullYear() - index,
  );

  const { data: currentUser, isPending: isUserPending } = useCurrentUser();
  // /admin/dashboard/* chỉ dành cho ADMIN, tài khoản tổ chức sẽ nhận 403
  const isAdmin = Boolean(currentUser?.roles.includes(SYSTEM_ROLES.ADMIN));

  const overviewQuery = useDashboardOverview(period, isAdmin);
  const trendQuery = useDashboardAdoptionTrend(year, isAdmin);
  const rescueQuery = useDashboardRescueSummary(period, isAdmin);
  const topOrganizationsQuery = useDashboardTopOrganizations(period, isAdmin);
  const pendingTasksQuery = useDashboardPendingTasks(period, isAdmin);

  if (isUserPending) {
    return (
      <div className="grid gap-4 p-4 lg:p-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-4 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>
              Thống kê toàn hệ thống chỉ dành cho quản trị viên. Hãy dùng các mục
              quản lý ở thanh bên để làm việc với dữ liệu của trung tâm.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const trendItems = trendQuery.data?.items ?? [];
  const pendingTasks = pendingTasksQuery.data?.items ?? [];
  const topOrganizations = topOrganizationsQuery.data?.items ?? [];

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Select
            value={String(month)}
            onValueChange={(value) => setMonth(Number(value))}
          >
            <SelectTrigger size="sm" aria-label="Chọn tháng" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((item) => (
                <SelectItem key={item} value={String(item)}>
                  Tháng {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(year)}
            onValueChange={(value) => setYear(Number(value))}
          >
            <SelectTrigger size="sm" aria-label="Chọn năm" className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((item) => (
                <SelectItem key={item} value={String(item)}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {overviewQuery.isError ? (
        <Card>
          <CardContent>
            <SectionMessage>
              Không thể tải số liệu tổng quan: {overviewQuery.error.message}
            </SectionMessage>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {KPI_LABELS.map(({ key, label }) => (
            <KpiCard
              key={key}
              label={label}
              item={overviewQuery.data?.kpis[key]}
              loading={overviewQuery.isPending}
            />
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Đơn nhận nuôi theo tháng</CardTitle>
          <CardDescription>Năm {year}</CardDescription>
        </CardHeader>
        <CardContent>
          {trendQuery.isPending ? (
            <Skeleton className="h-72 w-full" />
          ) : trendQuery.isError ? (
            <SectionMessage>
              Không thể tải biểu đồ: {trendQuery.error.message}
            </SectionMessage>
          ) : trendItems.length === 0 ? (
            <SectionMessage>Chưa có đơn nhận nuôi trong năm này.</SectionMessage>
          ) : (
            <AdoptionTrendChart items={trendItems} />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ca cứu hộ</CardTitle>
            <CardDescription>
              Tháng {month}/{year}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rescueQuery.isPending ? (
              <Skeleton className="h-48 w-full" />
            ) : rescueQuery.isError ? (
              <SectionMessage>
                Không thể tải số liệu cứu hộ: {rescueQuery.error.message}
              </SectionMessage>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                <CountList
                  title="Theo trạng thái"
                  items={rescueQuery.data.byStatus.map((item) => ({
                    key: item.status,
                    label: item.label,
                    count: item.count,
                  }))}
                />
                <CountList
                  title="Theo mức ưu tiên"
                  items={rescueQuery.data.byPriority.map((item) => ({
                    key: item.priority,
                    label: item.label,
                    count: item.count,
                  }))}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Việc cần xử lý</CardTitle>
            <CardDescription>
              Tháng {month}/{year}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingTasksQuery.isPending ? (
              <Skeleton className="h-48 w-full" />
            ) : pendingTasksQuery.isError ? (
              <SectionMessage>
                Không thể tải việc cần xử lý: {pendingTasksQuery.error.message}
              </SectionMessage>
            ) : pendingTasks.length === 0 ? (
              <SectionMessage>Không có việc nào đang chờ.</SectionMessage>
            ) : (
              <ul className="max-h-72 divide-y overflow-y-auto">
                {pendingTasks.map((task) => (
                  <li
                    key={task.taskId}
                    className="flex items-center justify-between gap-3 py-2 text-sm"
                  >
                    {/* actionUrl trỏ tới /<trang>/<id>, FE chỉ có trang danh sách */}
                    <Link
                      href={`/${task.actionUrl.split("/")[1] ?? ""}`}
                      className="min-w-0 truncate hover:underline"
                    >
                      {task.title}
                    </Link>
                    <Badge variant="outline" className="shrink-0">
                      {task.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trung tâm hoạt động nhiều nhất</CardTitle>
          <CardDescription>
            Tháng {month}/{year}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topOrganizationsQuery.isPending ? (
            <Skeleton className="h-48 w-full" />
          ) : topOrganizationsQuery.isError ? (
            <SectionMessage>
              Không thể tải danh sách: {topOrganizationsQuery.error.message}
            </SectionMessage>
          ) : topOrganizations.length === 0 ? (
            <SectionMessage>Chưa có dữ liệu trong kỳ này.</SectionMessage>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trung tâm</TableHead>
                  <TableHead className="text-right">Thú cưng</TableHead>
                  <TableHead className="text-right">Ca cứu hộ mở</TableHead>
                  <TableHead className="text-right">Đơn chờ duyệt</TableHead>
                  <TableHead className="text-right">Đã nhận nuôi</TableHead>
                  <TableHead className="text-right">Cảnh báo sức khỏe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topOrganizations.map((organization) => (
                  <TableRow key={organization.organizationId}>
                    <TableCell className="font-medium">
                      {organization.organizationName}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {organization.totalPets}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {organization.openRescueCases}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {organization.pendingAdoptions}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {organization.completedAdoptions}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {organization.healthAlerts}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
