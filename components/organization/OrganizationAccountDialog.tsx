"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { useCreateOrganizationAccount } from "@/hooks/use-admin";
import {
  ORGANIZATION_ACCOUNT_ROLES,
  ORGANIZATION_ROLE_LABEL,
  organizationAccountDefaultValues,
  organizationAccountSchema,
  type OrganizationAccountValues,
} from "@/lib/schemas/organization";

export interface OrganizationAccountDialogProps {
  organizationId: string;
  organizationName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Admin creates a ready-to-use account that already belongs to the organization. */
export function OrganizationAccountDialog({
  organizationId,
  organizationName,
  open,
  onOpenChange,
}: OrganizationAccountDialogProps) {
  const createAccount = useCreateOrganizationAccount(organizationId);
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<OrganizationAccountValues>({
    resolver: zodResolver(organizationAccountSchema),
    defaultValues: organizationAccountDefaultValues,
  });

  const close = () => {
    reset(organizationAccountDefaultValues);
    onOpenChange(false);
  };

  const submit = handleSubmit(async (values) => {
    try {
      await createAccount.mutateAsync(values);
      toast.success(`Đã tạo tài khoản ${values.username}`);
      close();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không tạo được tài khoản");
    }
  });

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo tài khoản cho trạm</DialogTitle>
          <DialogDescription>
            {organizationName ? `${organizationName} · ` : ""}Tài khoản hoạt động ngay, không cần xác minh email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="org-account-username">Tên đăng nhập</FieldLabel>
              <FieldContent>
                <Input id="org-account-username" autoComplete="off" {...register("username")} />
                <FieldError errors={[errors.username]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="org-account-email">Email</FieldLabel>
              <FieldContent>
                <Input id="org-account-email" type="email" autoComplete="off" {...register("email")} />
                <FieldError errors={[errors.email]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="org-account-password">Mật khẩu</FieldLabel>
              <FieldContent>
                <Input
                  id="org-account-password"
                  type="password"
                  autoComplete="new-password"
                  {...register("password")}
                />
                <FieldError errors={[errors.password]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Vai trò trong trạm</FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name="organizationRole"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-label="Vai trò trong trạm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORGANIZATION_ACCOUNT_ROLES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {ORGANIZATION_ROLE_LABEL[role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.organizationRole]} />
              </FieldContent>
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={close}>
              Hủy
            </Button>
            <Button type="submit" disabled={createAccount.isPending}>
              {createAccount.isPending ? "Đang tạo..." : "Tạo tài khoản"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
