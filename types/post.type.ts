import { baseEntity } from "./core.type";

export interface Post extends baseEntity {
  post_id: string;
  author_id?: string;
  rescue_case_id?: string;

  content?: string;
}
export interface PostMedia {
  post_id: string;
  media_id: string;
}

export interface Tag extends baseEntity {
  tag_id: string;
  code?: string;
  name?: string;
  description?: string;
}

export interface PostTag {
  post_id: string;
  tag_id: string;
}
export interface PostMedia {
  post_id: string;
  media_id: string;
}

export interface Tag extends baseEntity {
  tag_id: string;
  code?: string;
  name?: string;
  description?: string;
}

export interface PostTag {
  post_id: string;
  tag_id: string;
}
