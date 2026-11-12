"use client";

import * as React from "react";
import { PenSquare } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { NearbyCasesStrip } from "@/components/community/NearbyCasesStrip";
import { PostCard } from "@/components/community/PostCard";
import { PostComposerDialog } from "@/components/community/PostComposerDialog";
import { RescueCaseDialog } from "@/components/community/RescueCaseDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePostFeed } from "@/hooks/use-post";
import { useRequireLogin } from "@/hooks/use-require-login";
import type { RescueCaseBrief } from "@/lib/rescue-case-display";
import type { PostFeedFilters } from "@/types/post.type";

const PAGE_SIZE = 10;
/** The open-cases block sits after this many posts, where a reader has started scrolling. */
const STRIP_AFTER = 2;

type FeedTab = "all" | "needs-help" | "rescue" | "adoption";

const FEED_TABS: Array<{ value: FeedTab; label: string; filters: PostFeedFilters }> = [
  { value: "all", label: "Tất cả", filters: {} },
  { value: "needs-help", label: "Đang cần giúp", filters: { hasOpenCase: true } },
  { value: "rescue", label: "Cứu hộ", filters: { category: "RESCUE" } },
  { value: "adoption", label: "Nhận nuôi", filters: { category: "ADOPTION" } },
];

export default function CommunityPage() {
  const { requireLogin } = useRequireLogin();
  const [tab, setTab] = React.useState<FeedTab>("all");
  const [composerOpen, setComposerOpen] = React.useState(false);
  const [caseToWriteAbout, setCaseToWriteAbout] =
    React.useState<RescueCaseBrief | null>(null);
  const [openCaseId, setOpenCaseId] = React.useState<string | null>(null);

  const filters = FEED_TABS.find((item) => item.value === tab)?.filters ?? {};
  const feedQuery = usePostFeed({ pageSize: PAGE_SIZE, ...filters });
  const posts = feedQuery.data?.pages.flatMap((page) => page.items) ?? [];

  const openComposer = (rescueCase: RescueCaseBrief | null) => {
    if (!requireLogin("Hãy đăng nhập để đăng bài.")) return;
    setCaseToWriteAbout(rescueCase);
    setComposerOpen(true);
  };

  const strip = (
    <NearbyCasesStrip
      onViewCase={(rescueCase) => setOpenCaseId(rescueCase.caseId)}
      onWritePost={openComposer}
    />
  );

  return (
    <div className="bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_16%,#fffaf5_100%)]">
      <div className="container mx-auto max-w-2xl px-4 py-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Cộng đồng
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tin từ mọi người, và những ca cứu hộ đang cần một bàn tay.
            </p>
          </div>
          <Button type="button" onClick={() => openComposer(null)}>
            <PenSquare className="size-4" />
            Đăng bài
          </Button>
        </div>

        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as FeedTab)}
          className="mt-5"
        >
          <TabsList className="grid w-full grid-cols-4">
            {FEED_TABS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mt-5 space-y-4">
          {feedQuery.isPending ? (
            [0, 1, 2].map((row) => (
              <Skeleton key={row} className="h-40 w-full rounded-2xl" />
            ))
          ) : feedQuery.isError ? (
            <EmptyState
              title="Không tải được bảng tin"
              message="Hãy kiểm tra kết nối rồi tải lại trang."
            />
          ) : (
            <>
              {posts.length === 0 ? (
                <>
                  <EmptyState
                    title="Chưa có bài đăng nào"
                    message="Hãy là người đầu tiên chia sẻ, hoặc xem các ca đang cần giúp bên dưới."
                  />
                  {strip}
                </>
              ) : (
                posts.map((post, index) => (
                  <React.Fragment key={post.postId}>
                    <PostCard post={post} onOpenCase={setOpenCaseId} />
                    {index === Math.min(STRIP_AFTER, posts.length) - 1
                      ? strip
                      : null}
                  </React.Fragment>
                ))
              )}

              {feedQuery.hasNextPage ? (
                <div className="flex justify-center pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => feedQuery.fetchNextPage()}
                    disabled={feedQuery.isFetchingNextPage}
                  >
                    {feedQuery.isFetchingNextPage ? "Đang tải..." : "Xem thêm"}
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      <PostComposerDialog
        open={composerOpen}
        onOpenChange={setComposerOpen}
        initialCase={caseToWriteAbout}
      />
      <RescueCaseDialog caseId={openCaseId} onClose={() => setOpenCaseId(null)} />
    </div>
  );
}
