export function normalizeRole(role?: string | null) {
  return role?.toUpperCase();
}

export function hasAnySystemRole(
  userSystemRoles: string[] = [],
  allowedSystemRoles: string[] = []
) {
  if (!allowedSystemRoles || allowedSystemRoles.length === 0) return false;
  const normalizedUserRoles = userSystemRoles.map((role) =>
    role.toUpperCase()
  );

  return allowedSystemRoles.some((role) =>
    normalizedUserRoles.includes(role.toUpperCase())
  );
}

export function hasOrganizationRole(
  userOrganizationRole?: string | null,
  allowedOrganizationRoles: string[] = []
) {
  if (!userOrganizationRole) return false;
  if (!allowedOrganizationRoles || allowedOrganizationRoles.length === 0) return false;

  return allowedOrganizationRoles.some(
    (role) => role.toUpperCase() === userOrganizationRole.toUpperCase()
  );
}

export function canAccessByRoles({
  userSystemRoles = [],
  userOrganizationRole,
  allowedSystemRoles = [],
  allowedOrganizationRoles = [],
}: {
  userSystemRoles?: string[];
  userOrganizationRole?: string | null;
  allowedSystemRoles?: string[];
  allowedOrganizationRoles?: string[];
}) {
  // If no roles are specified for restriction, default to allowing access or checking ADMIN
  if (allowedSystemRoles.length === 0 && allowedOrganizationRoles.length === 0) {
    // If empty, let's say it requires ADMIN or is restricted. But based on layout:
    // "Nếu item không khai báo quyền thì mặc định chỉ ADMIN hoặc theo logic bảo mật hiện tại"
    // Let's check hasAnySystemRole(userSystemRoles, ["ADMIN"])
    return hasAnySystemRole(userSystemRoles, ["ADMIN"]);
  }

  return (
    hasAnySystemRole(userSystemRoles, allowedSystemRoles) ||
    hasOrganizationRole(userOrganizationRole, allowedOrganizationRoles)
  );
}
