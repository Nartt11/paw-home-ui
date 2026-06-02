import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const completeRescueSchema = z.object({
  verificationImages: z
    .array(z.any())
    .min(1, "Vui lòng chọn ít nhất 1 ảnh xác thực.")
    .refine(
      (files) => files.every((file) => file instanceof File),
      "Tất cả tệp phải là ảnh hợp lệ."
    )
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      "Kích thước mỗi ảnh không được vượt quá 5MB."
    )
    .refine(
      (files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Chỉ hỗ trợ định dạng JPEG, PNG và WEBP."
    ),
  rescueNote: z.string().trim().optional(),
  rescuedAt: z.string().min(1, "Vui lòng chọn thời gian cứu hộ thành công."),
  locationNote: z.string().trim().optional(),
  confirmRescued: z.boolean().refine((val) => val === true, {
    message: "Bạn phải xác nhận thú đã được cứu hộ thành công.",
  }),
});

export type CompleteRescueFormValues = z.infer<typeof completeRescueSchema>;
