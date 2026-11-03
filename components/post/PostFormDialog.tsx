"use client";

import * as React from "react";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import {
  MAX_POST_MEDIA,
  postFormDefaultValues,
  postFormSchema,
  type PostFormValues,
} from "@/lib/schemas/post";
import type { Post } from "@/types/post.type";

import { RescueCaseSelect } from "@/components/rescue-case/RescueCaseSelect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useUploadTempMedia } from "@/hooks/use-media";
import { useTags } from "@/hooks/use-tag";

const ACCEPTED_POST_IMAGE_TYPES = "image/jpeg,image/png,image/webp";
const TAG_LIST_PARAMS = { page: 0, pageSize: 100 };

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
    media: post.media.map(({ mediaId, url }) => ({ mediaId, url })),
    tagCodes: post.tags,
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
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    reset,
    setValue,
  } = form;

  const uploadTempMediaMutation = useUploadTempMedia();
  const tagsQuery = useTags(TAG_LIST_PARAMS);
  const media = useWatch({ control, name: "media" });

  React.useEffect(() => {
    if (!open) {
      reset(postFormDefaultValues);
      return;
    }

    reset(getInitialValues(post));
  }, [open, post, reset]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    if (getValues("media").length + files.length > MAX_POST_MEDIA) {
      toast.error(`Chỉ được đính kèm tối đa ${MAX_POST_MEDIA} ảnh`);
      return;
    }

    try {
      const uploads = await Promise.all(
        files.map((file) => uploadTempMediaMutation.mutateAsync({ file })),
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

  const isBusy =
    Boolean(loading) || Boolean(submitting) || uploadTempMediaMutation.isPending;
  const isCreate = mode === "create";
  const tags = tagsQuery.data?.content ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-3xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {isCreate ? "Thêm bài đăng" : "Cập nhật bài đăng"}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Nhập nội dung, chọn ca cứu hộ, ảnh và thẻ cho bài đăng mới."
              : "Cập nhật nội dung, ảnh và thẻ cho bài đăng."}
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
              <FieldGroup className="grid gap-5">
                <Field>
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
                    <FieldLabel htmlFor="post-rescue-case">
                      Ca cứu hộ (tùy chọn)
                    </FieldLabel>
                    <FieldContent>
                      <Controller
                        control={control}
                        name="rescueCaseId"
                        render={({ field }) => (
                          <RescueCaseSelect
                            id="post-rescue-case"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isBusy}
                            invalid={Boolean(errors.rescueCaseId)}
                          />
                        )}
                      />
                      <FieldError errors={[errors.rescueCaseId]} />
                    </FieldContent>
                  </Field>
                ) : null}

                <Field>
                  <FieldLabel htmlFor="post-images">Ảnh đính kèm</FieldLabel>
                  <FieldContent>
                    <Input
                      id="post-images"
                      type="file"
                      multiple
                      accept={ACCEPTED_POST_IMAGE_TYPES}
                      disabled={isBusy}
                      onChange={handleImageChange}
                    />
                    <FieldError errors={[errors.media]} />
                    {uploadTempMediaMutation.isPending ? (
                      <p className="text-sm text-muted-foreground">
                        Đang tải ảnh lên...
                      </p>
                    ) : null}
                    {media.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {media.map((item, index) => (
                          <div
                            key={item.mediaId}
                            className="overflow-hidden rounded-md border border-input bg-muted/30"
                          >
                            <div className="relative h-32 w-full">
                              <Image
                                src={item.url}
                                alt={`Ảnh bài đăng ${index + 1}`}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div className="p-2">
                              <Button
                                type="button"
                                variant="secondary"
                                className="w-full"
                                onClick={() => removeImage(item.mediaId)}
                                disabled={isBusy}
                              >
                                Xóa ảnh này
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Thẻ</FieldLabel>
                  <FieldContent>
                    <Controller
                      control={control}
                      name="tagCodes"
                      render={({ field }) =>
                        tags.length > 0 ? (
                          <div className="grid max-h-44 gap-2 overflow-y-auto rounded-md border border-input p-3 sm:grid-cols-2">
                            {tags.map((tag) => (
                              <label
                                key={tag.code}
                                className="flex items-center gap-2 text-sm"
                              >
                                <Checkbox
                                  checked={field.value.includes(tag.code)}
                                  disabled={isBusy}
                                  onCheckedChange={(checked) =>
                                    field.onChange(
                                      checked
                                        ? [...field.value, tag.code]
                                        : field.value.filter(
                                            (code) => code !== tag.code,
                                          ),
                                    )
                                  }
                                />
                                {tag.name}
                              </label>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {tagsQuery.isPending
                              ? "Đang tải danh sách thẻ..."
                              : "Chưa có thẻ nào trong hệ thống."}
                          </p>
                        )
                      }
                    />
                    <FieldError errors={[errors.tagCodes]} />
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
