"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  AdminTableEmptyRow,
  AdminTableSkeletonRows,
} from "@/components/common/admin/AdminTableState";
import { DeleteModal } from "@/components/common/admin/DeleteModal";
import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { PageControls } from "@/components/common/PageControl";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useCreateRole, useDeleteRole, useRoles } from "@/hooks/use-role";
import { useCreateTag, useDeleteTag, useTags } from "@/hooks/use-tag";
import { useListUrlState } from "@/hooks/use-list-url-state";
import {
  catalogItemDefaultValues,
  catalogItemSchema,
  type CatalogItemValues,
} from "@/lib/schemas/catalog";

type Resource = "roles" | "tags";

const COPY: Record<Resource, { title: string; description: string; noun: string }> = {
  roles: {
    title: "Vai trò & quyền",
    description: "Các vai trò hệ thống dùng để phân quyền (RBAC)",
    noun: "vai trò",
  },
  tags: {
    title: "Quản lý thẻ",
    description: "Thẻ dùng để phân loại bài đăng",
    noun: "thẻ",
  },
};

interface Row {
  id: string;
  code: string;
  name: string;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Có lỗi xảy ra";
}

// Both resources expose the same shape (code, name, description), so one screen serves both.
function useCatalog(resource: Resource, page: number, pageSize: number) {
  const isRole = resource === "roles";
  const roles = useRoles({ page, pageSize });
  const tags = useTags({ page, pageSize });
  const createRole = useCreateRole();
  const createTag = useCreateTag();
  const deleteRole = useDeleteRole();
  const deleteTag = useDeleteTag();

  const query = isRole ? roles : tags;
  const rows: Row[] = isRole
    ? (roles.data?.content ?? []).map((r) => ({ id: String(r.roleId), code: r.code, name: r.name }))
    : (tags.data?.content ?? []).map((t) => ({ id: t.tagId, code: t.code, name: t.name }));

  return {
    data: query.data,
    loading: query.isPending,
    rows,
    create: isRole ? createRole : createTag,
    remove: (id: string) =>
      isRole ? deleteRole.mutateAsync(Number(id)) : deleteTag.mutateAsync(id),
    removing: isRole ? deleteRole.isPending : deleteTag.isPending,
  };
}

export function CatalogManager({ resource }: { resource: Resource }) {
  const copy = COPY[resource];
  const { page, size, setPage, setSize } = useListUrlState();
  const catalog = useCatalog(resource, page, size);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const form = useForm<CatalogItemValues>({
    resolver: zodResolver(catalogItemSchema),
    defaultValues: catalogItemDefaultValues,
  });
  const { errors } = form.formState;

  const handleCreate = form.handleSubmit(async (values) => {
    try {
      await catalog.create.mutateAsync({
        ...values,
        description: values.description || undefined,
      });
      toast.success(`Đã tạo ${copy.noun}`);
      setCreateOpen(false);
      form.reset(catalogItemDefaultValues);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await catalog.remove(deleteId);
      toast.success(`Đã xóa ${copy.noun}`);
      setDeleteId(null);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <TitlePerPage
        title={copy.title}
        description={copy.description}
        buttonText={`Thêm ${copy.noun}`}
        handleOpenModal={() => setCreateOpen(true)}
      />

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead className="w-20 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {catalog.loading ? (
              <AdminTableSkeletonRows columnCount={3} />
            ) : catalog.rows.length === 0 ? (
              <AdminTableEmptyRow colSpan={3} title={`Chưa có ${copy.noun} nào`} />
            ) : (
              catalog.rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-sm">{row.code}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Xóa ${row.name}`}
                      onClick={() => setDeleteId(row.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PageControls
        page={catalog.data?.page ?? page}
        pageSize={catalog.data?.size ?? size}
        totalPages={catalog.data?.totalPages ?? 1}
        totalItems={catalog.data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setSize}
      />

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) form.reset(catalogItemDefaultValues);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm {copy.noun}</DialogTitle>
            <DialogDescription>Mã là duy nhất và không đổi được sau khi tạo.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="catalog-code">Mã</FieldLabel>
                <FieldContent>
                  <Input id="catalog-code" placeholder="VD: VOLUNTEER" {...form.register("code")} />
                  <FieldError errors={[errors.code]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="catalog-name">Tên</FieldLabel>
                <FieldContent>
                  <Input id="catalog-name" {...form.register("name")} />
                  <FieldError errors={[errors.name]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="catalog-description">Mô tả</FieldLabel>
                <FieldContent>
                  <Textarea id="catalog-description" rows={3} {...form.register("description")} />
                  <FieldError errors={[errors.description]} />
                </FieldContent>
              </Field>
            </FieldGroup>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={catalog.create.isPending}>
                {catalog.create.isPending ? "Đang lưu..." : "Tạo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteModal
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={`Xóa ${copy.noun}`}
        description={`Bạn có chắc muốn xóa ${copy.noun} này không? Hành động không thể hoàn tác.`}
        confirming={catalog.removing}
        onConfirm={handleDelete}
      />
    </div>
  );
}
