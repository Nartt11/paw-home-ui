"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  usePostAnalysisMetrics,
  usePostAnalysisModel,
  useSwitchPostAnalysisModel,
} from "@/hooks/use-post-analysis";

const modelSchema = z.object({ model: z.string().min(1, "Chọn một model") });
type ModelValues = z.infer<typeof modelSchema>;

function percent(value?: number | null) {
  return value == null ? "—" : `${Math.round(value * 100)}%`;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Có lỗi xảy ra";
}

export function AiSettings() {
  const modelQuery = usePostAnalysisModel();
  const metricsQuery = usePostAnalysisMetrics();
  const switchModel = useSwitchPostAnalysisModel();
  const model = modelQuery.data;

  const form = useForm<ModelValues>({
    resolver: zodResolver(modelSchema),
    values: { model: model?.activeModel ?? "" },
  });

  const apply = async (next: string | null) => {
    try {
      await switchModel.mutateAsync(next);
      toast.success("Đã cập nhật model");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <TitlePerPage
        title="Cấu hình AI"
        description="Model phân tích bài đăng và độ chính xác theo từng phiên bản prompt"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Model phân tích bài đăng
            {model && (
              <Badge variant={model.aiEnabled ? "secondary" : "destructive"}>
                {model.aiEnabled ? "Đang bật" : "Đang tắt"}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Áp dụng từ lần gọi model tiếp theo. Mặc định: {model?.defaultModel ?? "—"}
            {!model?.aiEnabled && model ? " · Bật bằng biến môi trường AI_POST_ANALYSIS_ENABLED ở backend." : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {modelQuery.isPending ? (
            <p className="text-sm text-muted-foreground">Đang tải...</p>
          ) : modelQuery.isError || !model ? (
            <p className="text-sm text-destructive">Không tải được cấu hình model.</p>
          ) : (
            <form
              onSubmit={form.handleSubmit(({ model: next }) => apply(next))}
              className="flex flex-wrap items-center gap-3"
            >
              <Controller
                control={form.control}
                name="model"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-64" aria-label="Model">
                      <SelectValue placeholder="Chọn model" />
                    </SelectTrigger>
                    <SelectContent>
                      {model.allowedModels.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Button
                type="submit"
                disabled={switchModel.isPending || form.watch("model") === model.activeModel}
              >
                Áp dụng
              </Button>
              {model.overridden && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={switchModel.isPending}
                  onClick={() => apply(null)}
                >
                  Về mặc định
                </Button>
              )}
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Độ chính xác</CardTitle>
          <CardDescription>
            So với nhãn tác giả xác nhận. Chỉ tính các bài đã được tác giả xác nhận (cột &quot;Có nhãn&quot;).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prompt</TableHead>
                <TableHead>Model</TableHead>
                <TableHead className="text-right">Lượt chạy</TableHead>
                <TableHead className="text-right">Lỗi</TableHead>
                <TableHead className="text-right">Có nhãn</TableHead>
                <TableHead className="text-right">Chủ đề</TableHead>
                <TableHead className="text-right">Loài</TableHead>
                <TableHead className="text-right">Quận/huyện</TableHead>
                <TableHead className="text-right">Cần cứu hộ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metricsQuery.isPending ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : (metricsQuery.data ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    Chưa có lượt phân tích nào
                  </TableCell>
                </TableRow>
              ) : (
                metricsQuery.data!.map((m) => (
                  <TableRow key={`${m.promptVersion}-${m.model}`}>
                    <TableCell>v{m.promptVersion}</TableCell>
                    <TableCell className="font-mono text-xs">{m.model}</TableCell>
                    <TableCell className="text-right">{m.runs}</TableCell>
                    <TableCell className="text-right">{m.failed}</TableCell>
                    <TableCell className="text-right">{m.labelled}</TableCell>
                    <TableCell className="text-right">{percent(m.categoryAccuracy)}</TableCell>
                    <TableCell className="text-right">{percent(m.speciesAccuracy)}</TableCell>
                    <TableCell className="text-right">{percent(m.districtAccuracy)}</TableCell>
                    <TableCell className="text-right">{percent(m.needsRescueAccuracy)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
