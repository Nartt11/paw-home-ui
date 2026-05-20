export interface PostMediaDto {
  mediaId: string;
  uploaderId?: string;
  url: string;
  type?: string;
  createdAt?: string;
}

export interface PostSummaryDto {
  postId: string;
  authorId: string;
  authorUsername?: string;
  content: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  createdAt?: string;
}

export interface PostDto extends PostSummaryDto {
  rescueCaseId?: string;
  media: PostMediaDto[];
  updatedAt?: string;
}

export interface CreatePostPayloadDto {
  content: string;
  rescueCaseId?: string;
  mediaIds: string[];
  tagCodes: string[];
}

export interface UpdatePostPayloadDto {
  content: string;
  mediaIds: string[];
  tagCodes: string[];
}
