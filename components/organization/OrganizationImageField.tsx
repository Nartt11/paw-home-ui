"use client";

import * as React from "react";
import { ImageIcon, Loader2Icon, Trash2Icon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useConfirmMediaUpload, useUploadTempMedia } from "@/hooks/use-media";

const MAX_BYTES = 5 * 1024 * 1024;

export interface OrganizationImageFieldProps {
  id?: string;
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  /** Shown under the field, linked by aria-describedby. */
  describedById?: string;
}

/**
 * The centre's public photo: what people recognise it by on the map and its page.
 * Uploads to temp storage, then confirms it so the photo is kept, and hands back its URL.
 */
export function OrganizationImageField({ id, value, onChange, disabled, describedById }: OrganizationImageFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const upload = useUploadTempMedia();
  const confirm = useConfirmMediaUpload();
  const busy = upload.isPending || confirm.isPending;
  const errorId = id ? `${id}-error` : undefined;

  const pick = async (file?: File) => {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Hãy chọn một tệp ảnh (JPG, PNG, WebP).");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Ảnh lớn hơn 5 MB. Hãy chọn ảnh nhỏ hơn.");
      return;
    }
    try {
      const temp = await upload.mutateAsync({ file });
      const kept = await confirm.mutateAsync({ id: temp.mediaId, params: { folder: "organizations" } });
      onChange(kept.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được ảnh. Hãy thử lại.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative aspect-[16/9] w-full max-w-md overflow-hidden rounded-lg border bg-muted">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Ảnh đại diện của trung tâm" className="size-full object-cover" />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <ImageIcon className="size-8" aria-hidden />
            Chưa có ảnh
          </div>
        )}
        {busy ? (
          <div className="absolute inset-0 grid place-items-center bg-background/70" role="status">
            <Loader2Icon className="size-6 animate-spin" aria-hidden />
            <span className="sr-only">Đang tải ảnh lên</span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={disabled || busy}
          aria-describedby={[describedById, error ? errorId : null].filter(Boolean).join(" ") || undefined}
          aria-invalid={Boolean(error)}
          onChange={(event) => void pick(event.target.files?.[0])}
        />
        <Button type="button" variant="outline" size="sm" disabled={disabled || busy} onClick={() => inputRef.current?.click()}>
          <UploadIcon className="size-4" />
          {value ? "Đổi ảnh" : "Tải ảnh lên"}
        </Button>
        {value ? (
          <Button type="button" variant="ghost" size="sm" disabled={disabled || busy} onClick={() => onChange("")}>
            <Trash2Icon className="size-4" />
            Bỏ ảnh
          </Button>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
