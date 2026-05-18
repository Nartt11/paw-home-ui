import { z } from "zod";

export const adoptionRequestSchema = z.object({
  experience: z
    .string()
    .trim()
    .min(20, "Hay mo ta kinh nghiem cham soc toi thieu 20 ky tu")
    .max(1000, "Noi dung kinh nghiem khong duoc qua 1000 ky tu"),
  liveCondition: z
    .string()
    .trim()
    .min(20, "Hay mo ta dieu kien song toi thieu 20 ky tu")
    .max(1000, "Noi dung dieu kien song khong duoc qua 1000 ky tu"),
});

export type AdoptionRequestSchema = z.infer<typeof adoptionRequestSchema>;
