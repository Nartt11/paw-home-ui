"use client";

import Link from "next/link";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAuthErrorMessage, useResetPassword } from "@/hooks/use-auth";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/lib/schemas/auth";
import { APP_ROUTES } from "@/constants/routes";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isReset, setIsReset] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const resetPasswordMutation = useResetPassword();
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    clearErrors("root");

    if (!token) {
      setError("root", {
        type: "server",
        message: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
      });
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        new_password: data.new_password,
      });
      setIsReset(true);
    } catch (error) {
      setError("root", {
        type: "server",
        message: getAuthErrorMessage(error, "Đặt lại mật khẩu thất bại."),
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đặt lại mật khẩu</CardTitle>
        <CardDescription>
          Nhập mật khẩu mới cho tài khoản của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!token ? (
          <div className="space-y-4">
            <FieldError>Liên kết đặt lại mật khẩu không hợp lệ.</FieldError>
            <Button asChild className="w-full">
              <Link href="/quen-mat-khau">Yêu cầu liên kết mới</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={APP_ROUTES.HOME}>Về trang chủ</Link>
            </Button>
          </div>
        ) : isReset ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Mật khẩu đã được cập nhật. Bạn có thể đăng nhập lại ngay bây giờ.
            </p>
            <Button asChild className="w-full">
              <Link href="/dang-nhap">Đăng nhập</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={APP_ROUTES.HOME}>Về trang chủ</Link>
            </Button>
          </div>
        ) : (
          <>
            {errors.root?.message ? (
              <FieldError className="mb-4">{errors.root.message}</FieldError>
            ) : null}

            <form onSubmit={onSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="new_password">Mật khẩu mới</FieldLabel>
                  <div className="relative">
                    <Input
                      id="new_password"
                      type={showPassword ? "text" : "password"}
                      className="pr-10"
                      {...register("new_password")}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.new_password ? (
                    <FieldError>{errors.new_password.message}</FieldError>
                  ) : null}
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Xác nhận mật khẩu
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="pr-10"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword ? (
                    <FieldError>{errors.confirmPassword.message}</FieldError>
                  ) : null}
                </Field>

                <Field>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending
                      ? "Đang cập nhật..."
                      : "Cập nhật mật khẩu"}
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={APP_ROUTES.HOME}>Về trang chủ</Link>
                  </Button>
                  <FieldDescription className="text-center">
                    Quay lại <Link href="/dang-nhap">đăng nhập</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  );
}
