"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PostCard } from "@/components/community/PostCard";
import { RescueCaseDialog } from "@/components/community/RescueCaseDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_ROUTES } from "@/constants/routes";
import { usePostDetail } from "@/hooks/use-post";

/** One post on its own page: this is where a shared link lands, signed in or not. */
export default function CommunityPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const postQuery = usePostDetail(postId);
  const [openCaseId, setOpenCaseId] = React.useState<string | null>(null);

  return (
    <div className="bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_16%,#fffaf5_100%)]">
      <div className="container mx-auto max-w-2xl px-4 py-8 sm:py-10">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href={APP_ROUTES.COMMUNITY}>
            <ArrowLeft className="size-4" />
            Về bảng tin
          </Link>
        </Button>

        {postQuery.isPending ? (
          <Skeleton className="h-56 w-full rounded-2xl" />
        ) : postQuery.isError || !postQuery.data ? (
          <EmptyState
            title="Không tìm thấy bài đăng"
            message="Bài này có thể đã bị xoá, hoặc liên kết không đúng."
          />
        ) : (
          <PostCard
            post={postQuery.data}
            onOpenCase={setOpenCaseId}
            defaultCommentsOpen
          />
        )}
      </div>

      <RescueCaseDialog caseId={openCaseId} onClose={() => setOpenCaseId(null)} />
    </div>
  );
}
