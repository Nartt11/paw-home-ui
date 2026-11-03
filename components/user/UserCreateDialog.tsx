"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SYSTEM_ROLES } from "@/constants/roles";
import {
  createAccountDefaultValues,
  createAccountSchema,
  toCreateAccountPayload,
  type CreateAccountFormValues,
} from "@/lib/schemas/user";
import type { CreateAccountPayload } from "@/types/user.type";

export interface UserCreateDialogProps {
  open: boolean;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (payload: CreateAccountPayload) => void;
}

export function UserCreateDialog({
  open,
  submitting,
  onOpenChange,
  onSubmit,
}: UserCreateDialogProps) {
  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: createAccountDefaultValues,
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = form;

  React.useEffect(() => {
    if (!open) reset(createAccountDefaultValues);
  }, [open, reset]);

  const isBusy = Boolean(submitting);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thêm người dùng</DialogTitle>
          <DialogDescription>
            Tài khoản được tạo sẽ hoạt động ngay, không cần xác minh email.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-5"
          onSubmit={handleSubmit((values) =>
            onSubmit?.(toCreateAccountPayload(values)),
          )}
        >
          <FieldGroup className="grid gap-5 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="user-username">Tên đăng nhập</FieldLabel>
              <FieldContent>
                <Input
                  id="user-username"
                  autoComplete="off"
                  disabled={isBusy}
                  aria-invalid={Boolean(errors.username)}
                  {...register("username")}
                />
                <FieldError errors={[errors.username]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="user-email">Email</FieldLabel>
              <FieldContent>
                <Input
                  id="user-email"
                  type="email"
                  autoComplete="off"
                  disabled={isBusy}
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                <FieldError errors={[errors.email]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="user-password">Mật khẩu</FieldLabel>
              <FieldContent>
                <Input
                  id="user-password"
                  type="password"
                  autoComplete="new-password"
                  disabled={isBusy}
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
                <FieldError errors={[errors.password]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Vai trò</FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name="systemRole"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isBusy}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SYSTEM_ROLES.USER}>
                          Người dùng
                        </SelectItem>
                        <SelectItem value={SYSTEM_ROLES.ADMIN}>
                          Quản trị viên
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="user-full-name">Họ tên (tùy chọn)</FieldLabel>
              <FieldContent>
                <Input
                  id="user-full-name"
                  disabled={isBusy}
                  {...register("fullName")}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="user-phone">
                Số điện thoại (tùy chọn)
              </FieldLabel>
              <FieldContent>
                <Input
                  id="user-phone"
                  disabled={isBusy}
                  aria-invalid={Boolean(errors.phone)}
                  {...register("phone")}
                />
                <FieldError errors={[errors.phone]} />
              </FieldContent>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              variant="secondary"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isBusy}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isBusy}>
              {submitting ? "Đang tạo..." : "Tạo tài khoản"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
