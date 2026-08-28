// frontend/app/services/organizations.service.ts
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

export type Organization = {
  _id: string;
  type: OrganizationType;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  languages?: string[];
  logo?: string;
  verified: boolean;
  status: OrganizationStatus;
  createdByUserId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateOrganizationInput = {
  type: OrganizationType;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  languages?: string[];
  logo?: string;
  verified?: boolean;
  status?: OrganizationStatus;
  createdByUserId?: string | null;
};

export const organizationsService = {
  async list() {
    return http<Organization[]>("/organizations");
  },

  async create(data: CreateOrganizationInput) {
    return http<Organization>("/organizations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getById(id: string) {
    return http<Organization>(`/organizations/${id}`);
  },

  async update(id: string, data: Partial<CreateOrganizationInput>) {
    return http<Organization>(`/organizations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async remove(id: string) {
    return http<{ message: string }>(`/organizations/${id}`, {
      method: "DELETE",
    });
  },
};