export interface Tag {
  tagId: string;
  code: string;
  name: string;
}   
export interface TagListParams {
    page?: number;
    size?: number;
}
export interface TagCreatePayload {
  code: string;
    name: string;
    description?: string;
}