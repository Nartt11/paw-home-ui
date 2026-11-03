import { z } from "zod";

import type { Banner, BannerPayload } from "@/types/banner.type";

export const BANNER_LINK_TYPES = ["EXTERNAL", "INTERNAL"] as const;
export const BANNER_TARGET_PAGES = [
  "HOME",
  "ADOPTION",
  "RESCUE",
  "DONATE",
] as const;

export const ACCEPTED_BANNER_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_BANNER_IMAGE_SIZE = 5 * 1024 * 1024;

const optionalText = z.string().trim();

function isFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function validateBannerImage(
  file: File | null,
  ctx: z.RefinementCtx,
  required: boolean,
) {
  if (!file) {
    if (required) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn ảnh banner",
      });
    }

    return;
  }

  if (!ACCEPTED_BANNER_IMAGE_TYPES.includes(file.type as never)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP",
    });
  }

  if (file.size > MAX_BANNER_IMAGE_SIZE) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ảnh banner không được vượt quá 5MB",
    });
  }
}

const baseBannerFormSchema = z.object({
  title: z.string().trim().min(1, "Tiêu đề không được để trống"),
  subtitle: optionalText,
  mediaId: z.string().trim(),
  imageFile: z.custom<File | null>((value) => value === null || isFile(value)),
  linkUrl: optionalText,
  linkType: z.enum(BANNER_LINK_TYPES),
  displayOrder: z
    .number()
    .int("Thứ tự hiển thị phải là số nguyên")
    .min(1, "Thứ tự hiển thị phải lớn hơn 0"),
  startDate: z.string(),
  endDate: z.string(),
  active: z.boolean(),
  targetPage: z.enum(BANNER_TARGET_PAGES),
});

export const createBannerFormSchema = baseBannerFormSchema.superRefine(
  (values, ctx) => {
    validateBannerImage(values.imageFile, ctx, true);
  },
);

export const updateBannerFormSchema = baseBannerFormSchema.superRefine(
  (values, ctx) => {
    validateBannerImage(values.imageFile, ctx, false);

    if (!values.imageFile && !values.mediaId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["imageFile"],
        message: "Banner cần có ảnh hiện tại hoặc ảnh mới",
      });
    }
  },
);

export type CreateBannerFormValues = z.infer<typeof createBannerFormSchema>;
export type UpdateBannerFormValues = z.infer<typeof updateBannerFormSchema>;

export const createBannerDefaultValues: CreateBannerFormValues = {
  title: "",
  subtitle: "",
  mediaId: "",
  imageFile: null,
  linkUrl: "",
  linkType: "EXTERNAL",
  displayOrder: 1,
  startDate: "",
  endDate: "",
  active: true,
  targetPage: "HOME",
};

export function getUpdateBannerDefaultValues(
  banner?: Banner | null,
): UpdateBannerFormValues {
  if (!banner) {
    return {
      ...createBannerDefaultValues,
    };
  }

  return {
    title: banner.title ?? "",
    subtitle: banner.subtitle ?? "",
    mediaId: banner.mediaId ?? "",
    imageFile: null,
    linkUrl: banner.linkUrl ?? "",
    linkType:
      banner.linkType === "INTERNAL" ? banner.linkType : "EXTERNAL",
    displayOrder:
      typeof banner.displayOrder === "number" ? banner.displayOrder : 1,
    startDate: banner.startDate ?? "",
    endDate: banner.endDate ?? "",
    active: Boolean(banner.active),
    targetPage: BANNER_TARGET_PAGES.includes(banner.targetPage as never)
      ? (banner.targetPage as (typeof BANNER_TARGET_PAGES)[number])
      : "HOME",
  };
}

export function toBannerPayload(values: {
  title: string;
  subtitle: string;
  mediaId: string;
  linkUrl: string;
  linkType: string;
  displayOrder: number;
  startDate: string;
  endDate: string;
  active: boolean;
  targetPage: string;
}): BannerPayload {
  return {
    title: values.title.trim(),
    subtitle: values.subtitle.trim(),
    mediaId: values.mediaId.trim(),
    linkUrl: values.linkUrl.trim(),
    linkType: values.linkType,
    displayOrder: values.displayOrder,
    startDate: values.startDate,
    endDate: values.endDate,
    active: values.active,
    targetPage: values.targetPage,
  };
}
