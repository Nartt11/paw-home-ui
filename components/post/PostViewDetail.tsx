"use client";

import type { Post } from "@/types/post.type";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface PostViewDetailProps {
  open: boolean;
  post?: Post | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDateTime(value?: string) {
  if (!value) return "Chưa có";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString("vi-VN");
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Chi tiet bai dang</DialogTitle>
          <DialogDescription>
            Xem nhanh cac truong da map va raw payload tra ve tu API.
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
                    <div className="rounded-lg bg-muted/50 p-4 text-sm whitespace-pre-wrap">
                      {renderValue(post.content)}
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-border p-4 text-sm">
                      <div className="mb-1 font-medium">Luot thich</div>
                      <div className="text-muted-foreground">
                        {post.likeCount}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border p-4 text-sm">
                      <div className="mb-1 font-medium">Binh luan</div>
                      <div className="text-muted-foreground">
                        {post.commentCount}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-border p-4 text-sm">
                      <div className="mb-2 font-medium">Tags</div>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.length > 0 ? (
                          post.tags.map((tag) => (
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
                        {post.media.length > 0 ? (
                          post.media.map((media) => (
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
                  <CardTitle>Raw payload</CardTitle>
                  <CardDescription>
                    Giúp đội chịu trách nhiệm khi backend bổ sung thêm trường.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                    {JSON.stringify(post.raw, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
