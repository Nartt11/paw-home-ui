import { HeartHandshakeIcon, PawPrintIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PawHomeLoading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.12),_transparent_42%),radial-gradient(circle_at_bottom_right,_hsl(var(--accent)/0.18),_transparent_30%)]" />

      <Card className="relative z-10 w-full max-w-xl border border-border/70 bg-card/95 backdrop-blur-sm">
        <CardHeader className="border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <PawPrintIcon className="size-6" />
            </div>
            <div className="space-y-1">
              <CardTitle>Đang tải dữ liệu</CardTitle>
              <CardDescription>
                PawHome đang chuẩn bị nội dung để bạn tiếp tục công việc.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 sm:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-[88%]" />
              <Skeleton className="h-10 w-[76%]" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-28 w-full rounded-xl" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-dashed border-border/70 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <HeartHandshakeIcon className="size-4 text-primary" />
              Đồng bộ giao diện và dữ liệu
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[92%]" />
            <Skeleton className="h-3 w-[78%]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
