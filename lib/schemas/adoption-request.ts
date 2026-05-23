import { z } from "zod";

export const adoptionRequestSchema = z.object({
  experience: z
    .string()
    .trim()
    .min(20, "Hãy mô tả kinh nghiệm chăm sóc tối thiểu 20 ký tự")
    .max(1000, "Nội dung kinh nghiệm không được quá 1000 ký tự"),
  liveCondition: z
    .string()
    .trim()
    .min(20, "Hãy mô tả điều kiện sống tối thiểu 20 ký tự")
    .max(1000, "Nội dung điều kiện sống không được quá 1000 ký tự"),
});

export type AdoptionRequestSchema = z.infer<typeof adoptionRequestSchema>;
