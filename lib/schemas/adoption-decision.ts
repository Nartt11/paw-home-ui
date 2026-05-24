import { z } from "zod";

export const approveAdoptionSchema = z.object({
  note: z.string().trim().max(1000),
  rejectReason: z.string().trim().max(500),
  readyAt: z.string(),
});

export const rejectAdoptionSchema = z.object({
  note: z.string().trim().max(1000),
  rejectReason: z.string().trim().min(1, "Vui long nhap ly do tu choi."),
  readyAt: z.string(),
});

export type ApproveAdoptionFormValues = z.infer<typeof approveAdoptionSchema>;
export type RejectAdoptionFormValues = z.infer<typeof rejectAdoptionSchema>;

export const approveAdoptionDefaultValues: ApproveAdoptionFormValues = {
  note: "",
  rejectReason: "",
  readyAt: "",
};

export const rejectAdoptionDefaultValues: RejectAdoptionFormValues = {
  note: "",
  rejectReason: "",
  readyAt: "",
};
