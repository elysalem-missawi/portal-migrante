import type { ServiceDeliveryMode } from "../models/service.model";
import type { PlatformRole } from "../models/user.model";

export type ReviewTargetType =
  | "organization"
  | "service";

export type ReviewDecision =
  | "approve"
  | "reject";

export const canReviewTarget = (
  role: PlatformRole | undefined,
  targetType: ReviewTargetType
): boolean => {
  if (targetType === "organization") {
    return role === "admin";
  }

  return (
    role === "moderator" ||
    role === "admin"
  );
};

export const serviceRequiresLocation = (
  deliveryModes: ServiceDeliveryMode[]
): boolean =>
  deliveryModes.some(
    (mode) =>
      mode === "in_person" ||
      mode === "hybrid"
  );

export const reviewStateFor = (
  decision: ReviewDecision
) =>
  decision === "approve"
    ? {
        status: "active" as const,
        verificationStatus:
          "verified" as const,
        verified: true,
      }
    : {
        status: "inactive" as const,
        verificationStatus:
          "rejected" as const,
        verified: false,
      };