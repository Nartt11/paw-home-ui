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
        message: getAuthErrorMessage(error, "Dang ky that bai."),
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dang ky tai khoan</CardTitle>
        <CardDescription>
          Tao tai khoan moi de bat dau su dung he thong cuu ho thu cung.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isRegistered ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Dang ky thanh cong. Vui long kiem tra email de xac thuc tai khoan
              truoc khi dang nhap.
            </p>
            <Button asChild className="w-full">
              <Link href="/dang-nhap">Di den dang nhap</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/xac-thuc-email">Nhap lai email xac thuc</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href={APP_ROUTES.HOME}>Ve trang chu</Link>
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
                  {errors.email ? <FieldError>{errors.email.message}</FieldError> : null}
                </Field>

                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input id="username" type="text" {...register("username")} />
                  {errors.username ? (
                    <FieldError>{errors.username.message}</FieldError>
                  ) : null}
                </Field>

                <Field>
                  <FieldLabel htmlFor="full_name">Ho ten</FieldLabel>
                  <Input id="full_name" type="text" {...register("full_name")} />
                  {errors.full_name ? (
                    <FieldError>{errors.full_name.message}</FieldError>
                  ) : null}
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Mat khau</FieldLabel>
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
                  <FieldLabel htmlFor="confirmPassword">Xac nhan mat khau</FieldLabel>
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
                    {registerMutation.isPending ? "Dang tao tai khoan..." : "Dang ky"}
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={APP_ROUTES.HOME}>Ve trang chu</Link>
                  </Button>
                  <FieldDescription className="text-center">
                    Da co tai khoan? <Link href="/dang-nhap">Dang nhap</Link>
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
