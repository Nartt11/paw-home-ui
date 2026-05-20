import { z } from "zod";

export const adoptionSearchSchema = z.object({
  searchName: z.string().trim().max(100, "Tu khoa tim kiem qua dai"),
  gender: z.enum(["ALL", "MALE", "FEMALE", "UNKNOWN"]),
});

export type AdoptionSearchSchema = z.infer<typeof adoptionSearchSchema>;
