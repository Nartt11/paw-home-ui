"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth";
import axios from "axios";

interface LoginFormData {
  emailOrUsername: string;
  password: string;
}

export default function LoginForm() {
  const [showPw, setShowPw] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => login(data),
  });
  const onSubmit = handleSubmit((data) => {
    console.log(data);
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        console.log(res);
        const accessToken = res.data.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        router.push("/dashboard");
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || "Login failed";

          setError("root", {
            type: "server",
            message,
          });
        }
      },
    });
  });

  return (
    <div className="flex flex-col gap-6 m-10">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* error tu sever */}
          {errors.root && <p>{errors.root.message}</p>}
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="text"
                  placeholder="m@example.com"
                  {...register("emailOrUsername", {
                    required: {
                      value: true,
                      message: "Email or username is required",
                    },
                  })}
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
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                    minLength: {
                      value: 8,
                      message: "Password must be at least 6 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Password must be at most 100 characters",
                    },
                  })}
                />
                {errors.password && (
                  <FieldError className="text-red-500">
                    {errors.password.message}
                  </FieldError>
                )}
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/dang-ki">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
