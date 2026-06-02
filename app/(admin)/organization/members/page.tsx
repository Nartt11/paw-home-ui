"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  Shield, 
  UserCheck, 
  Mail, 
  Users, 
  MoreVertical, 
  RefreshCw
} from "lucide-react";

import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { PageControls } from "@/components/common/PageControl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AdminTableEmptyRow,
  AdminTableSkeletonRows,
} from "@/components/common/admin/AdminTableState";

import { useCurrentUser } from "@/hooks/use-current-user";
import { 
  useOrganizationMembers, 
  useAddOrganizationMember, 
  useRemoveOrganizationMember,
  useUpdateOrganizationMemberRole 
} from "@/hooks/use-organization";
import RequireAuth from "@/components/auth/RequireAuth";
import { ORGANIZATION_ROLES } from "@/constants/roles";

// Form schemas
const addMemberSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  role: z.enum(["STAFF", "VET"]),
});
type AddMemberFormValues = z.infer<typeof addMemberSchema>;

const editRoleSchema = z.object({
  role: z.enum(["OWNER", "STAFF", "VET"]),
});
type EditRoleFormValues = z.infer<typeof editRoleSchema>;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Có lỗi xảy ra";
}

function roleBadge(role?: string) {
  const r = role?.toUpperCase();
  const map: Record<string, { label: string; className: string }> = {
    OWNER: {
      label: "Chủ sở hữu",
      className: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50",
    },
    STAFF: {
      label: "Nhân viên",
      className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
    },
    VET: {
      label: "Bác sĩ thú y",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
    },
    MEMBER: {
      label: "Thành viên",
      className: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50",
    },
  };

  const item = map[r || ""] ?? { label: role || "MEMBER", className: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50" };
  return <Badge variant="outline" className={item.className}>{item.label}</Badge>;
}

export default function OrganizationMembersPage() {
  const router = useRouter();
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState(10);

  // Modal Dialog states
  const [addOpen, setAddOpen] = React.useState(false);
  const [editRoleOpen, setEditRoleOpen] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<any | null>(null);

  // Auth Context
  const { data: currentUser } = useCurrentUser();
  const activeOrgId = currentUser?.organizationId;

  // Management Permission check (only OWNER can manage)
  const canManage = React.useMemo(() => {
    return currentUser?.organizationRole === ORGANIZATION_ROLES.OWNER;
  }, [currentUser?.organizationRole]);

  // Fetching data
  const membersQuery = useOrganizationMembers(activeOrgId || undefined, {
    page,
    size,
  });

  // Mutations
  const addMemberMutation = useAddOrganizationMember();
  const updateRoleMutation = useUpdateOrganizationMemberRole();
  const removeMemberMutation = useRemoveOrganizationMember();

  // Form setups
  const addForm = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      email: "",
      role: "STAFF",
    },
  });

  const editForm = useForm<EditRoleFormValues>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      role: "STAFF",
    },
  });

  // Dialog callbacks
  const handleOpenAddDialog = React.useCallback(() => {
    addForm.reset({
      email: "",
      role: "STAFF",
    });
    setAddOpen(true);
  }, [addForm]);

  const handleOpenEditRoleDialog = React.useCallback((member: any) => {
    setSelectedMember(member);
    editForm.reset({
      role: (member.role || member.organizationRole || "STAFF") as "OWNER" | "STAFF" | "VET",
    });
    setEditRoleOpen(true);
  }, [editForm]);

  const handleAddMemberSubmit = addForm.handleSubmit(async (values) => {
    if (!activeOrgId) return;
    try {
      await addMemberMutation.mutateAsync({
        id: activeOrgId,
        payload: {
          email: values.email,
          role: values.role,
        },
      });
      setAddOpen(false);
      toast.success("Đã thêm thành viên thành công");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  const handleEditRoleSubmit = editForm.handleSubmit(async (values) => {
    if (!activeOrgId || !selectedMember) return;
    const targetUserId = selectedMember.userId || selectedMember.user_id;
    try {
      await updateRoleMutation.mutateAsync({
        id: activeOrgId,
        userId: targetUserId,
        payload: {
          role: values.role,
        },
      });
      setEditRoleOpen(false);
      toast.success("Cập nhật vai trò thành công");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  const handleRemoveMember = React.useCallback(async (member: any) => {
    if (!activeOrgId) return;
    const targetUserId = member.userId || member.user_id;
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa thành viên khỏi tổ chức?`);
    if (!confirmed) return;

    try {
      await removeMemberMutation.mutateAsync({
        id: activeOrgId,
        userId: targetUserId,
      });
      toast.success("Đã xóa thành viên khỏi tổ chức");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }, [activeOrgId, removeMemberMutation]);

  const members = React.useMemo(() => {
    return membersQuery.data?.content ?? [];
  }, [membersQuery.data]);

  const totalPages = membersQuery.data?.totalPages ?? 1;
  const totalElements = membersQuery.data?.totalElements ?? 0;

  return (
    <RequireAuth
      allowedSystemRoles={[]}
      allowedOrganizationRoles={[
        ORGANIZATION_ROLES.OWNER,
        ORGANIZATION_ROLES.STAFF,
      ]}
    >
      <div className="space-y-6">
        <TitlePerPage
          title="Quản lý thành viên"
          description="Quản trị phân quyền thành viên và vai trò trong tổ chức."
          buttonText={canManage && activeOrgId ? "Thêm thành viên" : undefined}
          handleOpenModal={handleOpenAddDialog}
        />

        {/* Members List Table */}
        <Card className="overflow-hidden border border-border shadow-sm">
          <CardHeader className="bg-card">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Danh sách thành viên
                </CardTitle>
                <CardDescription>
                  Tổng số: {totalElements} thành viên trong tổ chức.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3"
                onClick={() => void membersQuery.refetch()}
                disabled={membersQuery.isRefetching}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${membersQuery.isRefetching ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-1/3">Thành viên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead className="w-32">Vai trò</TableHead>
                    {canManage && <TableHead className="w-20 text-right"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {membersQuery.isPending ? (
                    <AdminTableSkeletonRows columnCount={canManage ? 5 : 4} rowCount={4} />
                  ) : members.length === 0 ? (
                    <AdminTableEmptyRow
                      colSpan={canManage ? 5 : 4}
                      title="Chưa có thành viên nào"
                      description="Chưa có người dùng nào trực thuộc tổ chức này."
                    />
                  ) : (
                    members.map((member: any) => {
                      const memberUserId = member.userId || member.user_id;
                      const isSelf = memberUserId === currentUser?.userId;

                      return (
                        <TableRow key={memberUserId} className="hover:bg-muted/30">
                          <TableCell className="align-middle">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={member.avatarUrl} alt={member.fullName || member.username} />
                                <AvatarFallback className="bg-muted text-xs font-semibold">
                                  {(member.fullName || member.username || "?").substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold text-foreground flex items-center gap-1.5">
                                  {member.fullName || member.username || "Chưa cập nhật"}
                                  {isSelf && (
                                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-normal">
                                      Bạn
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground font-mono">
                                  ID: {memberUserId.substring(0, 8)}...
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="align-middle text-muted-foreground text-sm">
                            {member.email || "—"}
                          </TableCell>
                          <TableCell className="align-middle text-muted-foreground text-sm">
                            {member.phone || "—"}
                          </TableCell>
                          <TableCell className="align-middle">
                            {roleBadge(member.role || member.organizationRole)}
                          </TableCell>
                          {canManage && (
                            <TableCell className="align-middle text-right">
                              {!isSelf && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleOpenEditRoleDialog(member)}>
                                      <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                                      Đổi vai trò
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleRemoveMember(member)}
                                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Xóa thành viên
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="py-4 border-t">
              <PageControls
                page={page}
                pageSize={size}
                totalPages={totalPages}
                totalItems={totalElements}
                onPageChange={setPage}
                onPageSizeChange={setSize}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dialog Add Member */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm thành viên</DialogTitle>
              <DialogDescription>
                Nhập email của người dùng bạn muốn thêm vào tổ chức cứu trợ.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddMemberSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-email">Email người dùng</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="add-email"
                    type="email"
                    placeholder="example@gmail.com"
                    className="pl-9"
                    disabled={addMemberMutation.isPending}
                    {...addForm.register("email")}
                  />
                </div>
                {addForm.formState.errors.email && (
                  <p className="text-xs text-destructive">{addForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-role">Vai trò</Label>
                <Controller
                  control={addForm.control}
                  name="role"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={addMemberMutation.isPending}
                    >
                      <SelectTrigger id="add-role">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STAFF">Nhân viên (STAFF)</SelectItem>
                        <SelectItem value="VET">Bác sĩ thú y (VET)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {addForm.formState.errors.role && (
                  <p className="text-xs text-destructive">{addForm.formState.errors.role.message}</p>
                )}
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddOpen(false)}
                  disabled={addMemberMutation.isPending}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={addMemberMutation.isPending}>
                  {addMemberMutation.isPending ? "Đang thêm..." : "Thêm vào tổ chức"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog Edit Member Role */}
        <Dialog open={editRoleOpen} onOpenChange={setEditRoleOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Thay đổi vai trò</DialogTitle>
              <DialogDescription>
                Cập nhật vai trò của thành viên <strong className="text-foreground">{selectedMember?.fullName || selectedMember?.username}</strong>.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditRoleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Vai trò mới</Label>
                <Controller
                  control={editForm.control}
                  name="role"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={updateRoleMutation.isPending}
                    >
                      <SelectTrigger id="edit-role">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STAFF">Nhân viên (STAFF)</SelectItem>
                        <SelectItem value="VET">Bác sĩ thú y (VET)</SelectItem>
                        <SelectItem value="OWNER">Chủ sở hữu (OWNER)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {editForm.formState.errors.role && (
                  <p className="text-xs text-destructive">{editForm.formState.errors.role.message}</p>
                )}
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditRoleOpen(false)}
                  disabled={updateRoleMutation.isPending}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={updateRoleMutation.isPending}>
                  {updateRoleMutation.isPending ? "Đang lưu..." : "Xác nhận thay đổi"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </RequireAuth>
  );
}
