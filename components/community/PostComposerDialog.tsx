"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Link2, Loader2, X } from "lucide-react";
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
import { useCreatePost } from "@/hooks/use-post";
import { HttpError } from "@/lib/http";
import {
  draftPostAboutCase,
  type RescueCaseBrief,
} from "@/lib/rescue-case-display";
import {
  MAX_COMMUNITY_POST_LENGTH,
  communityPostSchema,
  type CommunityPostValues,
} from "@/lib/schemas/community-post";

/** Business errors the backend returns when a post cannot be linked to a case. */
const LINK_ERROR_MESSAGE: Record<string, string> = {
  POST_RESCUE_CASE_ALREADY_SHARED:
    "Bạn đã chia sẻ ca này rồi. Mỗi người chỉ đăng một bài cho mỗi ca.",
  POST_RESCUE_CASE_CLOSED:
    "Ca này đã kết thúc nên không thể gắn vào bài mới.",
  POST_RESCUE_CASE_NOT_FOUND: "Không tìm thấy ca cứu hộ này nữa.",
};

export interface PostComposerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Set when the composer is opened from a case's "Chia sẻ" button. */
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
            Gắn một ca cứu hộ để mọi người thấy ngay bé đang ở đâu và cần gì.
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
  const createPostMutation = useCreatePost();

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
    },
  });
  const content = useWatch({ control, name: "content" });

  const attach = (rescueCase: RescueCaseBrief | null) => {
    setAttachedCase(rescueCase);
    setPickerOpen(false);
    setValue("rescueCaseId", rescueCase?.caseId ?? "", { shouldDirty: true });
    // offer a first draft, but never overwrite what the author already wrote
    if (rescueCase && !getValues("content").trim()) {
      setValue("content", draftPostAboutCase(rescueCase), { shouldDirty: true });
    }
  };

  const submit = handleSubmit(async (values) => {
    try {
      await createPostMutation.mutateAsync({
        content: values.content,
        rescueCaseId: values.rescueCaseId || undefined,
        mediaIds: [],
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

  const busy = createPostMutation.isPending;

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
            <span className="text-sm font-medium text-foreground">
              Chọn ca cứu hộ
            </span>
            <RescueCasePicker onPick={attach} />
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => setPickerOpen(true)}
          >
            <Link2 className="size-4" />
            Gắn ca cứu hộ
          </Button>
        )}
      </div>

      <DialogFooter className="border-t px-6 py-4">
        <Button type="button" variant="secondary" disabled={busy} onClick={onDone}>
          Huỷ
        </Button>
        <Button type="submit" disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : null}
          Đăng bài
        </Button>
      </DialogFooter>
    </form>
  );
}
