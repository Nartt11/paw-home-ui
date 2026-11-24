"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Loader2Icon, MailIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useForgotPassword } from "@/hooks/use-auth";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useProvinceDetail, useProvinces } from "@/hooks/use-location";
import { useConfirmMediaUpload, useUploadTempMedia } from "@/hooks/use-media";
import { useUpdateMyProfile } from "@/hooks/use-user";
import { findLocationByName } from "@/lib/location";

const NO_GENDER = "UNKNOWN";

const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Hãy nhập tên hiển thị").max(255, "Tên hiển thị quá dài"),
  avatarUrl: z.string(),
  phone: z
    .string()
    .trim()
    .refine((v) => !v || /^(?:\+84|0)\d{9,10}$/.test(v.replace(/[\s().-]+/g, "")), "Số điện thoại chưa đúng: bắt đầu bằng 0 hoặc +84, ví dụ 0901234567."),
  gender: z.enum(["MALE", "FEMALE", "UNKNOWN"]),
  streetAddress: z.string().trim().max(255, "Địa chỉ quá dài"),
  provinceCode: z.string(),
  provinceName: z.string(),
  wardCode: z.string(),
  wardName: z.string(),
});

type ProfileValues = z.infer<typeof profileSchema>;

const EMPTY: ProfileValues = {
  fullName: "",
  avatarUrl: "",
  phone: "",
  gender: NO_GENDER,
  streetAddress: "",
  provinceCode: "",
  provinceName: "",
  wardCode: "",
  wardName: "",
};

function FieldMessage({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (error) return <p id={`${id}-error`} className="text-sm text-destructive">{error}</p>;
  if (hint) return <p id={`${id}-hint`} className="text-xs text-muted-foreground">{hint}</p>;
  return null;
}

/**
 * The person's own profile: the display name everyone sees, photo, phone, gender and address.
 * Used on the public profile page and the staff profile page.
 */
export function ProfileForm() {
  const { data: user, isPending } = useCurrentUser();
  const update = useUpdateMyProfile();
  const upload = useUploadTempMedia();
  const confirm = useConfirmMediaUpload();
  const forgot = useForgotPassword();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = React.useState<string | null>(null);

  // The profile carries place names only; look their codes up so the pickers show them.
  const provincesQuery = useProvinces();
  const provinces = React.useMemo(() => provincesQuery.data?.content ?? [], [provincesQuery.data]);
  const savedProvince = React.useMemo(
    () => (user?.provinceName ? findLocationByName(provinces, user.provinceName) : undefined),
    [user, provinces],
  );
  const savedWardsQuery = useProvinceDetail(savedProvince ? String(savedProvince.code) : undefined);

  /** What is saved, in form shape. The form follows it: on load and again after a save. */
  const saved = React.useMemo<ProfileValues | undefined>(() => {
    if (!user) return undefined;
    if (user.provinceName && provinces.length === 0) return undefined; // wait for the catalogue
    const ward = user.wardName ? findLocationByName(savedWardsQuery.data?.wards ?? [], user.wardName) : undefined;
    return {
      fullName: user.fullName ?? "",
      avatarUrl: user.avatarUrl ?? "",
      phone: user.phone ?? "",
      gender: user.gender === "MALE" || user.gender === "FEMALE" ? user.gender : NO_GENDER,
      streetAddress: user.streetAddress ?? "",
      provinceCode: savedProvince ? String(savedProvince.code) : "",
      provinceName: savedProvince?.name ?? user.provinceName ?? "",
      wardCode: ward ? String(ward.code) : "",
      wardName: ward?.name ?? user.wardName ?? "",
    };
  }, [user, provinces.length, savedProvince, savedWardsQuery.data]);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: EMPTY,
    values: saved,
    resetOptions: { keepDirtyValues: true }, // late-arriving data never wipes what the person typed
    mode: "onTouched", // an error appears once the person leaves the field, and goes as soon as it is fixed
  });
  const { control, register, handleSubmit, reset, setValue, formState } = form;
  const { errors, isDirty, isSubmitting } = formState;

  const provinceCode = useWatch({ control, name: "provinceCode" });
  const wardsQuery = useProvinceDetail(provinceCode || undefined);
  const wards = React.useMemo(() => wardsQuery.data?.wards ?? [], [wardsQuery.data]);
  const avatarUrl = useWatch({ control, name: "avatarUrl" });
  const fullName = useWatch({ control, name: "fullName" });

  const pickPhoto = async (file?: File) => {
    setPhotoError(null);
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setPhotoError("Hãy chọn một ảnh JPG, PNG hoặc WebP, tối đa 5 MB.");
      return;
    }
    try {
      const temp = await upload.mutateAsync({ file });
      const kept = await confirm.mutateAsync({ id: temp.mediaId, params: { folder: "avatars" } });
      setValue("avatarUrl", kept.url, { shouldDirty: true });
    } catch (e) {
      setPhotoError(e instanceof Error ? e.message : "Không tải được ảnh. Hãy thử lại.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onSubmit = async (values: ProfileValues) => {
    try {
      await update.mutateAsync({ ...values, phone: values.phone.trim() });
      toast.success("Đã lưu hồ sơ");
      reset(values); // what was just saved is the new starting point
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không lưu được hồ sơ");
    }
  };

  const sendPasswordEmail = async () => {
    if (!user?.email) return;
    try {
      await forgot.mutateAsync({ email: user.email });
      toast.success(`Đã gửi email đặt lại mật khẩu tới ${user.email}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không gửi được email");
    }
  };

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Đang tải hồ sơ...</p>;
  }
  if (!user) {
    return <p className="text-sm text-muted-foreground">Hãy đăng nhập để xem hồ sơ.</p>;
  }

  const busyPhoto = upload.isPending || confirm.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6" noValidate>
      <div className="flex items-center gap-4">
        <Avatar className="size-20">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
          <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
            {(fullName.trim().split(/\s+/).at(-1)?.[0] ?? "?").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <input ref={fileRef} type="file" accept="image/*" className="sr-only" id="profile-photo"
            onChange={(e) => void pickPhoto(e.target.files?.[0])} aria-describedby={photoError ? "profile-photo-error" : undefined} />
          <Button type="button" variant="outline" size="sm" disabled={busyPhoto} onClick={() => fileRef.current?.click()}>
            {busyPhoto ? <Loader2Icon className="size-4 animate-spin" aria-hidden /> : <UploadIcon className="size-4" aria-hidden />}
            {avatarUrl ? "Đổi ảnh đại diện" : "Thêm ảnh đại diện"}
          </Button>
          {photoError ? <p id="profile-photo-error" className="text-sm text-destructive" role="alert">{photoError}</p> : null}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="profile-name">Tên hiển thị <span aria-hidden>*</span></Label>
        <Input id="profile-name" autoComplete="name" {...register("fullName")} aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? "profile-name-error" : "profile-name-hint"} />
        <FieldMessage id="profile-name" error={errors.fullName?.message}
          hint="Tên mọi người thấy trên bài đăng, ca cứu hộ và đơn nhận nuôi." />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-username">Tên đăng nhập</Label>
          <Input id="profile-username" value={user.username} readOnly aria-describedby="profile-username-hint" className="bg-muted" />
          <p id="profile-username-hint" className="text-xs text-muted-foreground">Chỉ dùng để đăng nhập, không hiện cho người khác.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-email">Email</Label>
          <Input id="profile-email" value={user.email} readOnly className="bg-muted" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-phone">Số điện thoại</Label>
          <Input id="profile-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0901234567" {...register("phone")}
            aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "profile-phone-error" : "profile-phone-hint"} />
          <FieldMessage id="profile-phone" error={errors.phone?.message} hint="Để trạm liên hệ khi bạn gửi đơn nhận nuôi." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-gender">Giới tính</Label>
          <Controller control={control} name="gender" render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="profile-gender"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="FEMALE">Nữ</SelectItem>
                <SelectItem value="MALE">Nam</SelectItem>
                <SelectItem value={NO_GENDER}>Không muốn nói</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium">Địa chỉ</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-province">Tỉnh / thành phố</Label>
            <Controller control={control} name="provinceCode" render={({ field }) => (
              <Select value={field.value} onValueChange={(code) => {
                field.onChange(code);
                setValue("provinceName", provinces.find((p) => String(p.code) === code)?.name ?? "", { shouldDirty: true });
                setValue("wardCode", "", { shouldDirty: true });
                setValue("wardName", "", { shouldDirty: true });
              }}>
                <SelectTrigger id="profile-province"><SelectValue placeholder="Chọn tỉnh / thành phố" /></SelectTrigger>
                <SelectContent>
                  {provinces.map((p) => <SelectItem key={p.code} value={String(p.code)}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-ward">Phường / xã</Label>
            <Controller control={control} name="wardCode" render={({ field }) => (
              <Select value={field.value} disabled={!provinceCode} onValueChange={(code) => {
                field.onChange(code);
                setValue("wardName", wards.find((w) => String(w.code) === code)?.name ?? "", { shouldDirty: true });
              }}>
                <SelectTrigger id="profile-ward"><SelectValue placeholder={provinceCode ? "Chọn phường / xã" : "Chọn tỉnh trước"} /></SelectTrigger>
                <SelectContent>
                  {wards.map((w) => <SelectItem key={w.code} value={String(w.code)}>{w.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-street">Số nhà, đường</Label>
          <Input id="profile-street" autoComplete="street-address" {...register("streetAddress")}
            aria-invalid={Boolean(errors.streetAddress)} aria-describedby={errors.streetAddress ? "profile-street-error" : undefined} />
          <FieldMessage id="profile-street" error={errors.streetAddress?.message} />
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={!isDirty || isSubmitting || busyPhoto}>
          {isSubmitting ? <Loader2Icon className="size-4 animate-spin" aria-hidden /> : null}
          Lưu hồ sơ
        </Button>
        {isDirty ? (
          <Button type="button" variant="ghost" onClick={() => reset(saved ?? EMPTY)}>
            Huỷ thay đổi
          </Button>
        ) : null}
      </div>

      <Separator />

      <section className="space-y-2" aria-labelledby="profile-password">
        <h3 id="profile-password" className="text-sm font-medium">Mật khẩu</h3>
        <p className="text-sm text-muted-foreground">Chúng tôi gửi một liên kết tới email của bạn để đặt mật khẩu mới.</p>
        <Button type="button" variant="outline" size="sm" onClick={() => void sendPasswordEmail()} disabled={forgot.isPending}>
          <MailIcon className="size-4" aria-hidden />
          Gửi email đổi mật khẩu
        </Button>
      </section>
    </form>
  );
}
