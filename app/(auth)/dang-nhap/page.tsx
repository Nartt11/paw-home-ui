"use client";

import Link from "next/link";
import * as React from "react";
import { useRouter } from "next/navigation";
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
import {
  useLogin,
  getAuthErrorMessage,
  getPostLoginRedirectPath,
} from "@/hooks/use-auth";
import { loginSchema, type LoginSchema } from "@/lib/schemas/auth";
import { APP_ROUTES } from "@/constants/routes";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const loginMutation = useLogin();

  const onSubmit = handleSubmit(async (data) => {
    clearErrors("root");

    try {
      const auth = await loginMutation.mutateAsync(data);
      console.log("Login successful:", getPostLoginRedirectPath(auth));

      router.replace(getPostLoginRedirectPath(auth));
      debugger;
    } catch (error) {
      setError("root", {
        type: "server",
        message: getAuthErrorMessage(error, "Đăng nhập thất bại."),
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>
          Sử dụng email hoặc tên đăng nhập để vào hệ thống.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errors.root?.message ? (
          <FieldError className="mb-4">{errors.root.message}</FieldError>
        ) : null}

        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="emailOrUsername">
                Email hoặc username
              </FieldLabel>
              <Input
                id="emailOrUsername"
                type="text"
                placeholder="m@example.com"
                {...register("emailOrUsername")}
              />
              {errors.emailOrUsername ? (
                <FieldError>{errors.emailOrUsername.message}</FieldError>
              ) : null}
            </Field>

            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                <Link
                  href="/quen-mat-khau"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={APP_ROUTES.HOME}>Về trang chủ</Link>
              </Button>
              <FieldDescription className="text-center">
                Chưa có tài khoản? <Link href="/dang-ki">Đăng ký</Link>
              </FieldDescription>
              <FieldDescription className="text-center">
                Cần xác thực email?{" "}
                <Link href="/xac-thuc-email">Xác thực tại đây</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
