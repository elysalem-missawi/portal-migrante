import {
  http,
} from "./api";

import type {
  Need,
} from "./needs.service";

/* =========================================================
   Types
========================================================= */

export type SupportRequestUrgency =
  | "normal"
  | "urgent"
  | "critical";

export type SupportRequestStatus =
  | "open"
  | "in_review"
  | "in_progress"
  | "resolved"
  | "closed";

export type SupportContactPreference =
  | "platform"
  | "email"
  | "phone";

export type SupportRequestUser = {
  _id:
    string;

  displayName?:
    string;

  fullName?:
    string;

  profileImage?:
    string;

  status?:
    string;
};

export type SupportRequestOrganization = {
  _id:
    string;

  name:
    string;

  slug?:
    string;

  status?:
    string;

  verificationStatus?:
    string;
};

export type SupportRequest = {
  _id:
    string;

  userId:
    | string
    | SupportRequestUser;

  mainNeedId:
    | string
    | Need;

  relatedNeedIds:
    Array<
      string |
      Need
    >;

  title:
    string;

  description:
    string;

  sourceLanguage:
    "es"
    | "eu"
    | "ar"
    | "en";

  urgency:
    SupportRequestUrgency;

  status:
    SupportRequestStatus;

  contactPreference:
    SupportContactPreference;

  assignedOrganizationId?:
    | string
    | SupportRequestOrganization
    | null;

  assignedUserId?:
    | string
    | SupportRequestUser
    | null;

  resolvedAt?:
    string | null;

  closedAt?:
    string | null;

  createdAt:
    string;

  updatedAt:
    string;
};

/* =========================================================
   Input
========================================================= */

export type CreateSupportRequestInput = {
  mainNeedId:
    string;

  relatedNeedIds?:
    string[];

  title:
    string;

  description:
    string;

  sourceLanguage:
    "es"
    | "eu"
    | "ar"
    | "en";

  urgency?:
    SupportRequestUrgency;

  contactPreference?:
    SupportContactPreference;
};

export type UpdateSupportRequestInput =
  Partial<
    CreateSupportRequestInput
  >;

/* =========================================================
   Service
========================================================= */

export const supportRequestsService = {
  create(
    data:
      CreateSupportRequestInput
  ) {
    return http<
      SupportRequest
    >(
      "/support-requests",
      {
        method:
          "POST",

        body:
          JSON.stringify(
            data
          ),
      }
    );
  },

  listMine(
    status?:
      SupportRequestStatus
  ) {
    const search =
      new URLSearchParams();

    if (status) {
      search.set(
        "status",
        status
      );
    }

    const suffix =
      search.toString()
        ? `?${search.toString()}`
        : "";

    return http<
      SupportRequest[]
    >(
      `/support-requests/my${suffix}`
    );
  },

  getById(
    id:
      string
  ) {
    return http<
      SupportRequest
    >(
      `/support-requests/${id}`
    );
  },

  update(
    id:
      string,

    data:
      UpdateSupportRequestInput
  ) {
    return http<
      SupportRequest
    >(
      `/support-requests/${id}`,
      {
        method:
          "PUT",

        body:
          JSON.stringify(
            data
          ),
      }
    );
  },

  close(
    id:
      string
  ) {
    return http<
      SupportRequest
    >(
      `/support-requests/${id}`,
      {
        method:
          "DELETE",
      }
    );
  },
};