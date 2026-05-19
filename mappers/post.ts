import type {
  PostDto,
  PostMediaDto,
  PostSummaryDto,
} from "@/services/post/post-dto";
import type { Post, PostMediaType } from "@/types/post.type";

function normalizeMediaType(type?: string): PostMediaType {
  if (type === "IMAGE" || type === "VIDEO") return type;
  return "UNKNOWN";
}

function mapPostMedia(dto: PostMediaDto) {
  return {
    mediaId: dto.mediaId,
    uploaderId: dto.uploaderId,
    url: dto.url,
    type: normalizeMediaType(dto.type),
    createdAt: dto.createdAt,
  };
}

export function mapPost(dto: PostSummaryDto | PostDto): Post {
  return {
    postId: dto.postId,
    authorId: dto.authorId,
    authorUsername: dto.authorUsername,
    rescueCaseId: "rescueCaseId" in dto ? dto.rescueCaseId : undefined,
    content: dto.content,
    tags: Array.isArray(dto.tags) ? dto.tags : [],
    media: "media" in dto && Array.isArray(dto.media) ? dto.media.map(mapPostMedia) : [],
    likeCount: typeof dto.likeCount === "number" ? dto.likeCount : 0,
    commentCount: typeof dto.commentCount === "number" ? dto.commentCount : 0,
    createdAt: dto.createdAt,
    updatedAt: "updatedAt" in dto ? dto.updatedAt : undefined,
    raw: dto as unknown as Record<string, unknown>,
  };
}
