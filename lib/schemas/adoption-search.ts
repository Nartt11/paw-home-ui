import { z } from "zod";

export const adoptionSearchSchema = z.object({
  searchName: z.string().trim().max(100, "Từ khóa tìm kiếm quá dài"),
  gender: z.enum(["ALL", "MALE", "FEMALE", "UNKNOWN"]),
  /** Province code, or ALL. */
  province: z.string(),
});

export type AdoptionSearchSchema = z.infer<typeof adoptionSearchSchema>;
