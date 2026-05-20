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
        message: getAuthErrorMessage(error, "Khong gui lai duoc email xac thuc."),
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xac thuc email</CardTitle>
        <CardDescription>
          Xac thuc tai khoan bang lien ket trong email hoac gui lai email moi.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {token ? (
          <div className="space-y-3 rounded-lg border p-4">
            {verifyEmailQuery.isPending ? (
              <p className="text-sm text-muted-foreground">
                Dang xac thuc email...
              </p>
            ) : verifyEmailQuery.isSuccess ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Email da duoc xac thuc thanh cong. Ban co the dang nhap ngay.
                </p>
                <Button asChild className="w-full">
                  <Link href="/dang-nhap">Dang nhap</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={APP_ROUTES.HOME}>Ve trang chu</Link>
                </Button>
              </>
            ) : (
              <>
                <FieldError>
                  {getAuthErrorMessage(
                    verifyEmailQuery.error,
                    "Xac thuc email that bai hoac lien ket da het han.",
                  )}
                </FieldError>
                <p className="text-sm text-muted-foreground">
                  Ban co the nhap email ben duoi de yeu cau gui lai lien ket moi.
                </p>
              </>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Chua co token xac thuc. Neu ban can gui lai email, hay dien form ben duoi.
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
              {errors.email ? <FieldError>{errors.email.message}</FieldError> : null}
            </Field>

            <Field>
              <Button
                type="submit"
                className="w-full"
                variant="outline"
                disabled={resendVerificationMutation.isPending}
              >
                {resendVerificationMutation.isPending ? "Dang gui lai..." : "Gui lai email xac thuc"}
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={APP_ROUTES.HOME}>Ve trang chu</Link>
              </Button>
              {resendVerificationMutation.isSuccess ? (
                <FieldDescription className="text-center">
                  Neu email hop le, he thong da gui lai huong dan xac thuc.
                </FieldDescription>
              ) : null}
              <FieldDescription className="text-center">
                Quay lai <Link href="/dang-nhap">dang nhap</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
