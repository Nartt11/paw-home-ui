"use client";

import Link from "next/link";
import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";

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
import { useForm } from "react-hook-form";

import authService from "@/services/auth";
import userService from "@/services/user/user";
import { HttpError, tokenStorage } from "@/lib/http";
import { loginSchema, type LoginSchema } from "@/lib/schemas/auth";
import { queryKeys } from "@/lib/query-keys";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof HttpError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export default function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const loginMutation = useMutation({
    mutationFn: authService.login,
  });

  const onSubmit = handleSubmit(async (data) => {
    clearErrors("root");

    try {
      const auth = await loginMutation.mutateAsync(data);

      tokenStorage.setAccessToken(auth.accessToken);
      tokenStorage.setRefreshToken(auth.refreshToken);

      try {
        await queryClient.fetchQuery({
          queryKey: queryKeys.auth.currentUser,
          queryFn: () => userService.getCurrentUser(),
          staleTime: 5 * 60 * 1000,
        });

        router.replace("/dashboard");
      } catch (error) {
        tokenStorage.clear();
        queryClient.removeQueries({ queryKey: queryKeys.auth.currentUser });

        setError("root", {
          type: "server",
          message: getErrorMessage(error, "Unable to load the current user."),
        });
      }
    } catch (error) {
      setError("root", {
        type: "server",
        message: getErrorMessage(error, "Login failed."),
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errors.root?.message ? (
          <FieldError className="mb-4 text-red-500">
            {errors.root.message}
          </FieldError>
        ) : null}
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="text"
                placeholder="m@example.com"
                {...register("emailOrUsername")}
              />
              {errors.emailOrUsername && (
                <FieldError className="text-red-500">
                  {errors.emailOrUsername.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
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
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <FieldError className="text-red-500">
                  {errors.password.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <Button type="submit" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
              <Button variant="outline" type="button">
                Login with Google
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link href="/dang-ki">Sign up</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
