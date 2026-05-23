"use client";

import Link from "next/link";
import * as React from "react";
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
import { getAuthErrorMessage, useRegister } from "@/hooks/use-auth";
import { registerSchema, type RegisterSchema } from "@/lib/schemas/auth";
import { APP_ROUTES } from "@/constants/routes";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isRegistered, setIsRegistered] = React.useState(false);

  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      full_name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    clearErrors("root");

    try {
      await registerMutation.mutateAsync({
        email: data.email,
        username: data.username,
        password: data.password,
        full_name: data.full_name?.trim() || undefined,
      });

      setIsRegistered(true);
      reset();
    } catch (error) {
      setError("root", {
        type: "server",
        message: getAuthErrorMessage(error, "Đăng ký thất bại."),
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đăng ký tài khoản</CardTitle>
        <CardDescription>
          Tạo tài khoản mới để bắt đầu sử dụng hệ thống cứu hộ thú cưng.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isRegistered ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản
              trước khi đăng nhập.
            </p>
            <Button asChild className="w-full">
              <Link href="/dang-nhap">Đi đến đăng nhập</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/xac-thuc-email">Nhập lại email xác thực</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
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
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input id="username" type="text" {...register("username")} />
                  {errors.username ? (
                    <FieldError>{errors.username.message}</FieldError>
                  ) : null}
                </Field>

                <Field>
                  <FieldLabel htmlFor="full_name">Họ tên</FieldLabel>
                  <Input
                    id="full_name"
                    type="text"
                    {...register("full_name")}
                  />
                  {errors.full_name ? (
                    <FieldError>{errors.full_name.message}</FieldError>
                  ) : null}
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="pr-10"
                      {...register("password")}
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
                  {errors.password ? (
                    <FieldError>{errors.password.message}</FieldError>
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
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending
                      ? "Đang tạo tài khoản..."
                      : "Đăng ký"}
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={APP_ROUTES.HOME}>Về trang chủ</Link>
                  </Button>
                  <FieldDescription className="text-center">
                    Đã có tài khoản? <Link href="/dang-nhap">Đăng nhập</Link>
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
