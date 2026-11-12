"use client";

import * as React from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { ImagePlus, Link2, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { RescueCaseCard } from "@/components/community/RescueCaseCard";
import { RescueCasePicker } from "@/components/community/RescueCasePicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useUploadTempMedia } from "@/hooks/use-media";
import { useCreatePost } from "@/hooks/use-post";
import { HttpError } from "@/lib/http";
import {
  draftPostAboutCase,
  type RescueCaseBrief,
} from "@/lib/rescue-case-display";
import {
  MAX_COMMUNITY_POST_IMAGES,
  MAX_COMMUNITY_POST_LENGTH,
  communityPostSchema,
  type CommunityPostValues,
} from "@/lib/schemas/community-post";

const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp";

/** Business errors the backend returns when a post cannot be linked to a case. */
const LINK_ERROR_MESSAGE: Record<string, string> = {
  POST_RESCUE_CASE_ALREADY_SHARED:
    "Bạn đã đăng bài về ca này rồi. Mỗi người chỉ đăng một bài cho mỗi ca.",
  POST_RESCUE_CASE_CLOSED:
    "Ca này đã kết thúc nên không thể gắn vào bài mới.",
  POST_RESCUE_CASE_NOT_FOUND: "Không tìm thấy ca cứu hộ này nữa.",
};

export interface PostComposerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Set when the composer is opened from a case's "Đăng bài về ca" button. */
  initialCase?: RescueCaseBrief | null;
}

export function PostComposerDialog({
  open,
  onOpenChange,
  initialCase,
}: PostComposerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Đăng bài lên cộng đồng</DialogTitle>
          <DialogDescription>
            Viết vài dòng, thêm ảnh nếu có. Bài về một ca cứu hộ thì gắn ca
            vào để mọi người mở xem được ngay.
          </DialogDescription>
        </DialogHeader>

        {/* The dialog unmounts its content when closed, so every opening starts from a clean form. */}
        <ComposerForm
          initialCase={initialCase ?? null}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function ComposerForm({
  initialCase,
  onDone,
}: {
  initialCase: RescueCaseBrief | null;
  onDone: () => void;
}) {
  const [attachedCase, setAttachedCase] =
    React.useState<RescueCaseBrief | null>(initialCase);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const createPostMutation = useCreatePost();
  const uploadMediaMutation = useUploadTempMedia();

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    setValue,
  } = useForm<CommunityPostValues>({
    resolver: zodResolver(communityPostSchema),
    defaultValues: {
      content: initialCase ? draftPostAboutCase(initialCase) : "",
      rescueCaseId: initialCase?.caseId ?? "",
      media: [],
    },
  });
  const content = useWatch({ control, name: "content" });
  const media = useWatch({ control, name: "media" });

  const attach = (rescueCase: RescueCaseBrief | null) => {
    setAttachedCase(rescueCase);
    setPickerOpen(false);
    setValue("rescueCaseId", rescueCase?.caseId ?? "", { shouldDirty: true });
    // offer a first draft, but never overwrite what the author already wrote
    if (rescueCase && !getValues("content").trim()) {
      setValue("content", draftPostAboutCase(rescueCase), { shouldDirty: true });
    }
  };

  const addImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    if (getValues("media").length + files.length > MAX_COMMUNITY_POST_IMAGES) {
      toast.error(`Chỉ được đính kèm tối đa ${MAX_COMMUNITY_POST_IMAGES} ảnh`);
      return;
    }

    try {
      const uploads = await Promise.all(
        files.map((file) => uploadMediaMutation.mutateAsync({ file })),
      );
      setValue(
        "media",
        [
          ...getValues("media"),
          ...uploads.map(({ mediaId, url }) => ({ mediaId, url })),
        ],
        { shouldDirty: true, shouldValidate: true },
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể tải ảnh lên",
      );
    }
  };

  const removeImage = (mediaId: string) => {
    setValue(
      "media",
      getValues("media").filter((item) => item.mediaId !== mediaId),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const submit = handleSubmit(async (values) => {
    try {
      await createPostMutation.mutateAsync({
        content: values.content,
        rescueCaseId: values.rescueCaseId || undefined,
        mediaIds: values.media.map((item) => item.mediaId),
        tagCodes: [],
      });
      toast.success("Đã đăng bài");
      onDone();
    } catch (error) {
      const known =
        error instanceof HttpError && error.errorCode
          ? LINK_ERROR_MESSAGE[error.errorCode]
          : undefined;
      toast.error(
        known ??
          (error instanceof Error ? error.message : "Không thể đăng bài"),
      );
    }
  });

  const uploading = uploadMediaMutation.isPending;
  const busy = createPostMutation.isPending || uploading;

  return (
    <form onSubmit={submit}>
      <div className="max-h-[calc(100vh-14rem)] space-y-4 overflow-y-auto px-6 py-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="community-post-content">Nội dung</FieldLabel>
            <FieldContent>
              <Textarea
                id="community-post-content"
                rows={5}
                placeholder="Bạn muốn chia sẻ điều gì?"
                disabled={busy}
                aria-invalid={Boolean(errors.content)}
                {...register("content")}
              />
              <div className="flex items-start justify-between gap-3">
                <FieldError errors={[errors.content]} />
                <span className="ml-auto text-xs text-muted-foreground">
                  {content.length}/{MAX_COMMUNITY_POST_LENGTH}
                </span>
              </div>
            </FieldContent>
          </Field>
        </FieldGroup>

        {media.length > 0 ? (
          <ul className="grid grid-cols-4 gap-2">
            {media.map((item, index) => (
              <li
                key={item.mediaId}
                className="relative aspect-square overflow-hidden rounded-lg border bg-muted"
              >
                <Image
                  src={item.url}
                  alt={`Ảnh đính kèm ${index + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  aria-label={`Bỏ ảnh ${index + 1}`}
                  disabled={busy}
                  onClick={() => removeImage(item.mediaId)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80 disabled:opacity-50"
                >
                  <X className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <FieldError errors={[errors.media]} />

        {attachedCase ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Ca cứu hộ được gắn
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={busy}
                onClick={() => attach(null)}
              >
                <X className="size-4" />
                Bỏ gắn
              </Button>
            </div>
            <RescueCaseCard rescueCase={attachedCase} />
          </div>
        ) : pickerOpen ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Chọn ca cứu hộ
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPickerOpen(false)}
              >
                Đóng
              </Button>
            </div>
            <RescueCasePicker onPick={attach} />
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_IMAGE_TYPES}
            className="hidden"
            aria-label="Chọn ảnh"
            onChange={addImages}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy || media.length >= MAX_COMMUNITY_POST_IMAGES}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ImagePlus className="size-4" />
            )}
            {uploading ? "Đang tải ảnh..." : "Thêm ảnh"}
          </Button>
          {!attachedCase && !pickerOpen ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => setPickerOpen(true)}
            >
              <Link2 className="size-4" />
              Gắn ca cứu hộ
            </Button>
          ) : null}
        </div>
      </div>

      <DialogFooter className="border-t px-6 py-4">
        <Button type="button" variant="secondary" disabled={busy} onClick={onDone}>
          Huỷ
        </Button>
        <Button type="submit" disabled={busy}>
          {createPostMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : null}
          Đăng bài
        </Button>
      </DialogFooter>
    </form>
  );
}
