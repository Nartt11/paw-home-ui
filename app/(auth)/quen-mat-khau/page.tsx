"use client";

import Link from "next/link";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/lib/schemas/auth";
import { getAuthErrorMessage, useForgotPassword } from "@/hooks/use-auth";
import { APP_ROUTES } from "@/constants/routes";

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = React.useState(false);
  const forgotPasswordMutation = useForgotPassword();
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    clearErrors("root");

    try {
      await forgotPasswordMutation.mutateAsync(data);
      setIsSent(true);
    } catch (error) {
      setError("root", {
        type: "server",
        message: getAuthErrorMessage(
          error,
          "Không gửi được email đặt lại mật khẩu.",
        ),
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quên mật khẩu</CardTitle>
        <CardDescription>
          Nhập email để nhận hướng dẫn đặt lại mật khẩu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSent ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Nếu email tồn tại trong hệ thống, bạn sẽ nhận được liên kết đặt
              lại mật khẩu trong ít phút.
            </p>
            <Button asChild className="w-full">
              <Link href="/dang-nhap">Quay lại đăng nhập</Link>
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
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email ? (
                    <FieldError>{errors.email.message}</FieldError>
                  ) : null}
                </Field>

                <Field>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={forgotPasswordMutation.isPending}
                  >
                    {forgotPasswordMutation.isPending
                      ? "Đang gửi..."
                      : "Gửi liên kết"}
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={APP_ROUTES.HOME}>Về trang chủ</Link>
                  </Button>
                  <FieldDescription className="text-center">
                    Nhớ mật khẩu rồi? <Link href="/dang-nhap">Đăng nhập</Link>
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
