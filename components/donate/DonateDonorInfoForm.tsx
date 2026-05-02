"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function DonateDonorInfoForm({
  name,
  email,
  message,
  showName,
  onChange,
}: {
  name: string;
  email: string;
  message: string;
  showName: boolean;
  onChange: (next: {
    name?: string;
    email?: string;
    message?: string;
    showName?: boolean;
  }) => void;
}) {
  return (
    <Card className="rounded-3xl shadow-sm ring-1 ring-slate-200">
      <CardHeader>
        <CardTitle className="text-base font-extrabold text-slate-900">
          Thông tin người ủng hộ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-xs text-slate-500">Họ và tên</Label>
          <Input
            value={name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Nguyễn Văn An"
            className="mt-2 border-slate-200 bg-slate-50"
          />
        </div>

        <div>
          <Label className="text-xs text-slate-500">Email</Label>
          <Input
            value={email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="email@gmail.com"
            className="mt-2 border-slate-200 bg-slate-50"
            type="email"
          />
        </div>

        <div>
          <Label className="text-xs text-slate-500">Lời nhắn (tuỳ chọn)</Label>
          <textarea
            value={message}
            onChange={(e) => onChange({ message: e.target.value })}
            placeholder="Gửi lời động viên đến PawHome và các bé thú cưng..."
            className="mt-2 min-h-24 w-full resize-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={showName}
            onCheckedChange={(v) => onChange({ showName: Boolean(v) })}
            id="showName"
          />
          <Label htmlFor="showName" className="text-xs text-slate-500">
            Hiển thị tên trong danh sách nhà hảo tâm
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
