import OrganizationMember, {
  OrganizationMemberRole,
} from "../models/organizationMember.model";
import { PlatformRole } from "../models/user.model";

const contentManagerRoles: OrganizationMemberRole[] = [
  "president",
  "organization_admin",
  "partner_manager",
];

const membershipManagerRoles: OrganizationMemberRole[] = [
  "president",
  "organization_admin",
];

export const isPlatformStaff = (
  role: PlatformRole | undefined
): boolean =>
  role === "moderator" || role === "admin" || role === "super_admin";

export const isPlatformAdmin = (
  role: PlatformRole | undefined
): boolean => role === "admin" || role === "super_admin";

async function hasOrganizationRole(
  userId: string,
  organizationId: string,
  roles: OrganizationMemberRole[]
): Promise<boolean> {
  return Boolean(
    await OrganizationMember.exists({
      userId,
      organizationId,
      status: "active",
      role: { $in: roles },
    })
  );
}

export async function canManageOrganization(
  userId: string,
  platformRole: PlatformRole | undefined,
  organizationId: string
): Promise<boolean> {
  if (isPlatformAdmin(platformRole)) return true;
  return hasOrganizationRole(userId, organizationId, contentManagerRoles);
}

export async function canManageOrganizationMembers(
  userId: string,
  platformRole: PlatformRole | undefined,
  organizationId: string
): Promise<boolean> {
  if (isPlatformAdmin(platformRole)) return true;
  return hasOrganizationRole(userId, organizationId, membershipManagerRoles);
}
