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
import { resetPasswordSchema, type ResetPasswordSchema } from "@/lib/schemas/auth";
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
        message: "Lien ket dat lai mat khau khong hop le hoac da het han.",
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
        message: getAuthErrorMessage(error, "Dat lai mat khau that bai."),
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dat lai mat khau</CardTitle>
        <CardDescription>
          Nhap mat khau moi cho tai khoan cua ban.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!token ? (
          <div className="space-y-4">
            <FieldError>Lien ket dat lai mat khau khong hop le.</FieldError>
            <Button asChild className="w-full">
              <Link href="/quen-mat-khau">Yeu cau lien ket moi</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={APP_ROUTES.HOME}>Ve trang chu</Link>
            </Button>
          </div>
        ) : isReset ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Mat khau da duoc cap nhat. Ban co the dang nhap lai ngay bay gio.
            </p>
            <Button asChild className="w-full">
              <Link href="/dang-nhap">Dang nhap</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
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
                  <FieldLabel htmlFor="new_password">Mat khau moi</FieldLabel>
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
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? "Dang cap nhat..." : "Cap nhat mat khau"}
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={APP_ROUTES.HOME}>Ve trang chu</Link>
                  </Button>
                  <FieldDescription className="text-center">
                    Quay lai <Link href="/dang-nhap">dang nhap</Link>
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
