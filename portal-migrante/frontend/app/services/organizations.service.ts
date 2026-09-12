import { http } from "./api";

export type OrganizationType =
  | "municipality"
  | "health_center"
  | "association"
  | "social_services_office"
  | "employment_office"
  | "legal_office"
  | "education_center"
  | "community_center"
  | "other";

export type OrganizationStatus =
  | "active"
  | "inactive"
  | "pending"
  | "archived";

export type VerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected";

export type EntityReference<T> = string | T | null;

export type OrganizationUserSummary = {
  _id: string;
  fullName?: string;
  displayName?: string;
};

export type Organization = {
  _id: string;
  type: OrganizationType;
  name: string;
  legalName?: string;
  registrationNumber?: string;
  slug: string;
  description?: string;
  website?: string;
  languages: string[];
  logo?: string;
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  verifiedByUserId?: EntityReference<OrganizationUserSummary>;
  status: OrganizationStatus;
  createdByUserId?: EntityReference<OrganizationUserSummary>;

  // Transitional fields retained while old records are migrated to locations.
  address?: string;
  phone?: string;
  email?: string;
  verified?: boolean;

  createdAt?: string;
  updatedAt?: string;
};

export type CreateOrganizationInput = {
  type: OrganizationType;
  name: string;
  legalName?: string;
  registrationNumber?: string;
  slug: string;
  description?: string;
  website?: string;
  languages?: string[];
  logo?: string;

  // Accepted for compatibility with the current registration form. The API
  // owns status and verification values when an organization is created.
  address?: string;
  phone?: string;
  email?: string;
  verified?: boolean;
  status?: OrganizationStatus;
};

export const organizationsService = {
  list() {
    return http<Organization[]>("/organizations");
  },

  create(data: CreateOrganizationInput) {
    return http<Organization>("/organizations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getById(id: string) {
    return http<Organization>("/organizations/" + id);
  },

  update(id: string, data: Partial<CreateOrganizationInput>) {
    return http<Organization>("/organizations/" + id, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  remove(id: string) {
    return http<Organization>("/organizations/" + id, {
      method: "DELETE",
    });
  },
};
