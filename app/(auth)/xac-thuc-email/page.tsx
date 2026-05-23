"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
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
  getAuthErrorMessage,
  useResendVerification,
  useVerifyEmail,
} from "@/hooks/use-auth";
import {
  resendVerificationSchema,
  type ResendVerificationSchema,
} from "@/lib/schemas/auth";
import { APP_ROUTES } from "@/constants/routes";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const verifyEmailQuery = useVerifyEmail(token);
  const resendVerificationMutation = useResendVerification();

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<ResendVerificationSchema>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    clearErrors("root");

    try {
      await resendVerificationMutation.mutateAsync(data);
    } catch (error) {
      setError("root", {
        type: "server",
        message: getAuthErrorMessage(
          error,
          "Không gửi lại được email xác thực.",
        ),
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xác thực email</CardTitle>
        <CardDescription>
          Xác thực tài khoản bằng liên kết trong email hoặc gửi lại email mới.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {token ? (
          <div className="space-y-3 rounded-lg border p-4">
            {verifyEmailQuery.isPending ? (
              <p className="text-sm text-muted-foreground">
                Đang xác thực email...
              </p>
            ) : verifyEmailQuery.isSuccess ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Email đã được xác thực thành công. Bạn có thể đăng nhập ngay.
                </p>
                <Button asChild className="w-full">
                  <Link href="/dang-nhap">Đăng nhập</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={APP_ROUTES.HOME}>Về trang chủ</Link>
                </Button>
              </>
            ) : (
              <>
                <FieldError>
                  {getAuthErrorMessage(
                    verifyEmailQuery.error,
                    "Xác thực email thất bại hoặc liên kết đã hết hạn.",
                  )}
                </FieldError>
                <p className="text-sm text-muted-foreground">
                  Bạn có thể nhập email bên dưới để yêu cầu gửi lại liên kết
                  mới.
                </p>
              </>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Chưa có token xác thực. Nếu bạn cần gửi lại email, hãy điền form bên
            dưới.
          </p>
        )}

        {errors.root?.message ? (
          <FieldError>{errors.root.message}</FieldError>
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
                variant="outline"
                disabled={resendVerificationMutation.isPending}
              >
                {resendVerificationMutation.isPending
                  ? "Đang gửi lại..."
                  : "Gửi lại email xác thực"}
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={APP_ROUTES.HOME}>Về trang chủ</Link>
              </Button>
              {resendVerificationMutation.isSuccess ? (
                <FieldDescription className="text-center">
                  Nếu email hợp lệ, hệ thống đã gửi lại hướng dẫn xác thực.
                </FieldDescription>
              ) : null}
              <FieldDescription className="text-center">
                Quay lại <Link href="/dang-nhap">đăng nhập</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
