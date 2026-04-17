import React from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

export default function KPICardPet({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value?: number;
  icon: any;
  color: string;
}) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5 flex items-center gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
            color,
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {title}
          </p>
          <h4 className="text-xl font-bold mt-0.5">
            {value === undefined ? "..." : value}
          </h4>
        </div>
      </CardContent>
    </Card>
  );
}
