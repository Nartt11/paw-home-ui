"use client";

import type { Post } from "@/types/post.type";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { parseApiDate, VN_TIME_ZONE } from "@/lib/datetime";

export interface PostViewDetailProps {
  open: boolean;
  post?: Post | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDateTime(value?: string) {
  if (!value) return "Chưa có";

  const parsed = parseApiDate(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString("vi-VN", { timeZone: VN_TIME_ZONE });
}

function renderValue(value?: string) {
  return value?.trim() ? value : "Chưa có";
}

export function PostViewDetail({
  open,
  post,
  loading,
  onOpenChange,
}: PostViewDetailProps) {
  const tags = Array.isArray(post?.tags) ? post.tags : [];
  const mediaList = Array.isArray(post?.media) ? post.media : [];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Chi tiết bài đăng</DialogTitle>
          <DialogDescription>
            Xem nhanh các trường chi tiết của bài đăng từ API.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
          <Separator className="my-4" />

          {loading && !post ? (
            <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
              Đang tải chi tiết bài đăng...
            </div>
          ) : !post ? (
            <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
              Chưa có dữ liệu bài đăng để hiển thị.
            </div>
          ) : (
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center gap-2">
                    <span>{post.postId || "Bài đăng không có ID"}</span>
                    {post.authorId ? (
                      <Badge variant="secondary">Author: {post.authorId}</Badge>
                    ) : null}
                    {post.authorUsername ? (
                      <Badge variant="secondary">
                        Username: {post.authorUsername}
                      </Badge>
                    ) : null}
                    {post.rescueCaseId ? (
                      <Badge variant="outline">
                        Rescue: {post.rescueCaseId}
                      </Badge>
                    ) : null}
                  </CardTitle>
                  <CardDescription>
                    Tạo lúc {formatDateTime(post.createdAt)}. Cập nhật lúc{" "}
                    {formatDateTime(post.updatedAt)}.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Nội dung</div>
                    <div className="whitespace-pre-wrap rounded-lg bg-muted/50 p-4 text-sm">
                      {renderValue(post.content)}
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-border p-4 text-sm">
                      <div className="mb-1 font-medium">Lượt thích</div>
                      <div className="text-muted-foreground">
                        {post.likeCount}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border p-4 text-sm">
                      <div className="mb-1 font-medium">Bình luận</div>
                      <div className="text-muted-foreground">
                        {post.commentCount}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-border p-4 text-sm">
                      <div className="mb-2 font-medium">Tags</div>
                      <div className="flex flex-wrap gap-2">
                        {tags.length > 0 ? (
                          tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">
                            Chưa có tag
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border p-4 text-sm">
                      <div className="mb-2 font-medium">Media</div>
                      <div className="space-y-2">
                        {mediaList.length > 0 ? (
                          mediaList.map((media) => (
                            <div
                              key={media.mediaId}
                              className="rounded-md bg-muted/50 p-3"
                            >
                              <div className="font-mono text-xs">
                                {media.mediaId}
                              </div>
                              <div className="break-all text-muted-foreground">
                                {media.url}
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {media.type}
                                {media.createdAt
                                  ? ` • ${formatDateTime(media.createdAt)}`
                                  : ""}
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="text-muted-foreground">
                            Chưa có media
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin bổ sung</CardTitle>
                  <CardDescription>
                    Các trường được trả về trong chi tiết bài đăng.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-border p-4 text-sm">
                    <div className="mb-1 font-medium">Post ID</div>
                    <div className="font-mono text-muted-foreground">
                      {post.postId}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border p-4 text-sm">
                    <div className="mb-1 font-medium">Rescue case</div>
                    <div className="text-muted-foreground">
                      {renderValue(post.rescueCaseId)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
