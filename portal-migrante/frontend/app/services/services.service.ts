import { http } from "./api";
import type {
  EntityReference,
  OrganizationStatus,
  OrganizationType,
  VerificationStatus,
} from "./organizations.service";
import type {
  MunicipalitySummary,
} from "./organization-locations.service";

export type ServiceCategoryStatus =
  | "active"
  | "inactive"
  | "archived";

export type ServiceCategorySummary = {
  _id: string;
  code: string;
  name: string;
  status?: ServiceCategoryStatus;
};

export type ServiceCategory =
  ServiceCategorySummary & {
    description?: string;
    parentCategoryId?: EntityReference<ServiceCategorySummary>;
    sortOrder: number;
    status: ServiceCategoryStatus;
    createdAt?: string;
    updatedAt?: string;
  };

export type ServiceOrganizationSummary = {
  _id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  status: OrganizationStatus;
  verificationStatus: VerificationStatus;
};

export type ServiceLocationSummary = {
  _id: string;
  name: string;
  slug: string;
  municipalityId?: EntityReference<MunicipalitySummary>;
  addressLine1: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  isHeadOffice: boolean;
  status: "active" | "inactive" | "archived";
};

export type ServiceDeliveryMode =
  | "in_person"
  | "online"
  | "phone"
  | "mobile"
  | "hybrid";

export type ServiceStatus =
  | "draft"
  | "active"
  | "inactive"
  | "archived";

export type ServiceCostType =
  | "free"
  | "paid"
  | "subsidized"
  | "unknown";

export type Service = {
  _id: string;
  organizationId:
    EntityReference<ServiceOrganizationSummary>;
  locationIds: Array<string | ServiceLocationSummary>;
  categoryId: EntityReference<ServiceCategorySummary>;
  title: string;
  description: string;
  deliveryModes: ServiceDeliveryMode[];
  eligibility?: string;
  requiredDocuments: string[];
  costType: ServiceCostType;
  appointmentRequired: boolean;
  website?: string;
  phone?: string;
  email?: string;
  languages: string[];
  verificationStatus: VerificationStatus;
  status: ServiceStatus;

  // Transitional fields for records created before the redesign.
  category?: string;
  municipality?: string;
  territory?: string;
  address?: string;
  verified?: boolean;

  createdAt?: string;
  updatedAt?: string;
};

export type ServiceFilters = {
  organizationId?: string;
  categoryId?: string;
  locationId?: string;
  q?: string;
};

export type ManagedServiceFilters =
  ServiceFilters & {
    status?: ServiceStatus;
  };

export type CreateServiceInput = {
  organizationId: string;
  locationIds?: string[];
  categoryId: string;
  title: string;
  description: string;
  deliveryModes?: ServiceDeliveryMode[];
  eligibility?: string;
  requiredDocuments?: string[];
  costType?: ServiceCostType;
  appointmentRequired?: boolean;
  website?: string;
  phone?: string;
  email?: string;
  languages?: string[];
};

function withQuery(path: string, values: object) {
  const search = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (typeof value === "string" && value) {
      search.set(key, value);
    }
  });

  const query = search.toString();
  return query ? path + "?" + query : path;
}

export const serviceCategoriesService = {
  list(status: ServiceCategoryStatus = "active") {
    return http<ServiceCategory[]>(
      withQuery("/service-categories", { status })
    );
  },
};

export const servicesService = {
  list(filters: ServiceFilters = {}) {
    return http<Service[]>(
      withQuery("/services", filters)
    );
  },

  listMine(filters: ManagedServiceFilters = {}) {
    return http<Service[]>(
      withQuery("/services/mine", filters)
    );
  },

  getById(id: string) {
    return http<Service>("/services/" + id);
  },

  create(data: CreateServiceInput) {
    return http<Service>("/services", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(
    id: string,
    data: Partial<CreateServiceInput>
  ) {
    return http<Service>("/services/" + id, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  remove(id: string) {
    return http<Service>("/services/" + id, {
      method: "DELETE",
    });
  },
};
