import OrganizationMember, {
  OrganizationMemberRole,
} from "../models/organizationMember.model";
import { PlatformRole } from "../models/user.model";

const organizationManagerRoles: OrganizationMemberRole[] = [
  "president",
  "organization_admin",
  "partner_manager",
];

export const isPlatformStaff = (
  role: PlatformRole | undefined
): boolean =>
  role === "moderator" || role === "admin" || role === "super_admin";

export async function canManageOrganization(
  userId: string,
  platformRole: PlatformRole | undefined,
  organizationId: string
): Promise<boolean> {
  if (isPlatformStaff(platformRole)) return true;

  return Boolean(
    await OrganizationMember.exists({
      userId,
      organizationId,
      status: "active",
      role: { $in: organizationManagerRoles },
    })
  );
}
