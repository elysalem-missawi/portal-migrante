import { http } from "./api";
import type {
  EntityReference,
  OrganizationStatus,
  OrganizationType,
  VerificationStatus,
} from "./organizations.service";

export type MunicipalitySummary = {
  _id: string;
  name: string;
  slug: string;
  territory: "alava" | "bizkaia" | "gipuzkoa";
  officialCode?: string;
};

export type OrganizationSummary = {
  _id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  status: OrganizationStatus;
  verificationStatus: VerificationStatus;
};

export type OpeningHour = {
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  opensAt?: string;
  closesAt?: string;
  closed: boolean;
};

export type OrganizationLocationStatus =
  | "active"
  | "inactive"
  | "archived";

export type OrganizationLocation = {
  _id: string;
  organizationId: EntityReference<OrganizationSummary>;
  municipalityId: EntityReference<MunicipalitySummary>;
  name: string;
  slug: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  openingHours: OpeningHour[];
  isHeadOffice: boolean;
  status: OrganizationLocationStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type OrganizationLocationFilters = {
  organizationId?: string;
  municipalityId?: string;
  status?: Extract<
    OrganizationLocationStatus,
    "active" | "inactive"
  >;
};

export type CreateOrganizationLocationInput = {
  organizationId: string;
  municipalityId: string;
  name: string;
  slug: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: OpeningHour[];
  isHeadOffice?: boolean;
  status?: Extract<
    OrganizationLocationStatus,
    "active" | "inactive"
  >;
};

function listPath(
  basePath: string,
  filters: OrganizationLocationFilters = {}
) {
  const search = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });

  const query = search.toString();
  return query ? basePath + "?" + query : basePath;
}

export function referenceId<T extends { _id: string }>(
  value: EntityReference<T> | undefined
) {
  if (!value) return "";
  return typeof value === "string" ? value : value._id;
}

export const organizationLocationsService = {
  list(filters: OrganizationLocationFilters = {}) {
    return http<OrganizationLocation[]>(
      listPath("/organization-locations", filters)
    );
  },

  listMine(filters: OrganizationLocationFilters = {}) {
    return http<OrganizationLocation[]>(
      listPath("/organization-locations/mine", filters)
    );
  },

  getById(id: string) {
    return http<OrganizationLocation>(
      "/organization-locations/" + id
    );
  },

  create(data: CreateOrganizationLocationInput) {
    return http<OrganizationLocation>("/organization-locations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(
    id: string,
    data: Partial<CreateOrganizationLocationInput>
  ) {
    return http<OrganizationLocation>(
      "/organization-locations/" + id,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  remove(id: string) {
    return http<OrganizationLocation>(
      "/organization-locations/" + id,
      { method: "DELETE" }
    );
  },
};
