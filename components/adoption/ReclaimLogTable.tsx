"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReclaimLogs } from "@/hooks/use-adoption";

/** Pets an organization took back from their adopter, newest first. */
export function ReclaimLogTable({ organizationId }: { organizationId?: string }) {
  // ponytail: first 20 only; add PageControls if centres reclaim often.
  const { data, isPending, isError } = useReclaimLogs({ organizationId, page: 0, pageSize: 20 });
  const logs = data?.content ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử đòi lại thú</CardTitle>
        <CardDescription>
          Thú được trạm thu hồi sau khi đã giao cho người nhận nuôi. Mỗi lần thu hồi trừ điểm uy tín người nhận nuôi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thời gian</TableHead>
              <TableHead>Lý do</TableHead>
              <TableHead className="text-right">Điểm uy tín</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : isError || logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  {isError ? "Không tải được lịch sử" : "Chưa có lần đòi lại nào"}
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.reclaimId}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(log.reclaimedAt).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell className="max-w-md whitespace-pre-line">{log.reason}</TableCell>
                  <TableCell className="text-right">{log.reputationDelta ?? "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
