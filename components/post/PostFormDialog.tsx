"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  postFormDefaultValues,
  postFormSchema,
  type PostFormValues,
} from "@/lib/schemas/post";
import type { Post } from "@/types/post.type";

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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export interface PostFormDialogProps {
  mode: "create" | "update";
  open: boolean;
  post?: Post | null;
  loading?: boolean;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: PostFormValues) => void;
}

function getInitialValues(post?: Post | null): PostFormValues {
  if (!post) return postFormDefaultValues;

  return {
    content: post.content,
    rescueCaseId: post.rescueCaseId ?? "",
    mediaIdsText: post.media.map((item) => item.mediaId).join(", "),
    tagCodesText: post.tags.join(", "),
  };
}

export function PostFormDialog({
  mode,
  open,
  post,
  loading,
  submitting,
  onOpenChange,
  onSubmit,
}: PostFormDialogProps) {
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: postFormDefaultValues,
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = form;

  React.useEffect(() => {
    if (!open) {
      reset(postFormDefaultValues);
      return;
    }

    reset(getInitialValues(post));
  }, [open, post, reset]);

  const isBusy = Boolean(loading) || Boolean(submitting);
  const isCreate = mode === "create";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-3xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {isCreate ? "Thêm bài đăng" : "Cập nhật bài đăng"}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Nhập nội dung, rescue case, media IDs và tag codes cho bài đăng mới."
              : "Cập nhật nội dung, media IDs và tag codes cho bài đăng."}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
          <Separator className="my-4" />

          {loading && !post ? (
            <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
              Đang tải dữ liệu bài đăng...
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={handleSubmit((values) => onSubmit?.(values))}
            >
              <FieldGroup className="grid gap-5 md:grid-cols-2">
                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="post-content">Nội dung</FieldLabel>
                  <FieldContent>
                    <Textarea
                      id="post-content"
                      placeholder="Nhập nội dung bài đăng..."
                      disabled={isBusy}
                      aria-invalid={Boolean(errors.content)}
                      {...register("content")}
                    />
                    <FieldError errors={[errors.content]} />
                  </FieldContent>
                </Field>

                {isCreate ? (
                  <Field>
                    <FieldLabel htmlFor="post-rescue-case-id">
                      Rescue case ID
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="post-rescue-case-id"
                        placeholder="case_123"
                        disabled={isBusy}
                        aria-invalid={Boolean(errors.rescueCaseId)}
                        {...register("rescueCaseId")}
                      />
                      <FieldError errors={[errors.rescueCaseId]} />
                    </FieldContent>
                  </Field>
                ) : null}

                <Field className={isCreate ? "" : "md:col-span-2"}>
                  <FieldLabel htmlFor="post-media-ids">Media IDs</FieldLabel>
                  <FieldContent>
                    <Textarea
                      id="post-media-ids"
                      placeholder="media-id-1, media-id-2"
                      disabled={isBusy}
                      aria-invalid={Boolean(errors.mediaIdsText)}
                      {...register("mediaIdsText")}
                    />
                    <FieldError errors={[errors.mediaIdsText]} />
                  </FieldContent>
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="post-tag-codes">Tag codes</FieldLabel>
                  <FieldContent>
                    <Textarea
                      id="post-tag-codes"
                      placeholder="rescue, urgent, dog"
                      disabled={isBusy}
                      aria-invalid={Boolean(errors.tagCodesText)}
                      {...register("tagCodesText")}
                    />
                    <FieldError errors={[errors.tagCodesText]} />
                  </FieldContent>
                </Field>
              </FieldGroup>

              <DialogFooter className="px-0 pb-0 pt-6">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => onOpenChange(false)}
                  disabled={isBusy}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isBusy}>
                  {submitting
                    ? isCreate
                      ? "Đang tạo..."
                      : "Đang cập nhật..."
                    : isCreate
                      ? "Tạo bài đăng"
                      : "Lưu thay đổi"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type { PostFormValues };
