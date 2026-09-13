import { http } from "./api";
import type {
  Organization,
  OrganizationUserSummary,
} from "./organizations.service";
import type {
  OrganizationLocation,
} from "./organization-locations.service";
import type { Service } from "./services.service";

export type ModerationTargetType = "organization" | "service";
export type ReviewDecision = "approve" | "reject";

export type ReviewOrganization = Organization & {
  createdByUserId?: string | OrganizationUserSummary | null;
  locations: OrganizationLocation[];
};

export type ReviewQueue = {
  organizations: ReviewOrganization[];
  services: Service[];
  recentActions: ModerationAction[];
  counts: {
    organizations: number;
    services: number;
  };
  permissions: {
    canReviewOrganizations: boolean;
    canReviewServices: boolean;
  };
};

export type ModerationUserSummary = {
  _id: string;
  fullName?: string;
  displayName?: string;
  email?: string;
};

export type ModerationAction = {
  _id: string;
  targetType: ModerationTargetType | "publication";
  targetId: string;
  targetLabel?: string;
  moderatorUserId: string | ModerationUserSummary;
  action:
    | ReviewDecision
    | "verify"
    | "unverify"
    | "hide"
    | "restore"
    | "archive"
    | "expire";
  reason?: string;
  previousStatus?: string;
  newStatus?: string;
  previousVerificationStatus?: string;
  newVerificationStatus?: string;
  createdAt: string;
};

export type ReviewTargetInput = {
  targetType: ModerationTargetType;
  targetId: string;
  decision: ReviewDecision;
  reason?: string;
};

export const moderationService = {
  getQueue(targetType: ModerationTargetType | "all" = "all") {
    return http<ReviewQueue>(
      "/moderation-actions/queue?targetType=" + targetType
    );
  },

  review(data: ReviewTargetInput) {
    return http<{
      target: Organization | Service;
      action: ModerationAction;
    }>("/moderation-actions/review", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getHistory(targetType: ModerationTargetType, targetId: string) {
    return http<ModerationAction[]>(
      "/moderation-actions/target/" +
        targetType +
        "/" +
        targetId
    );
  },
};
