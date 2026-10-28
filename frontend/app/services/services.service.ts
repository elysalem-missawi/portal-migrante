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

import type {
  Need,
} from "./needs.service";

/* =========================================================
   Service Categories
========================================================= */

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

/* =========================================================
   Organization
========================================================= */

export type ServiceOrganizationSummary = {
  _id: string;

  name: string;

  slug: string;

  type: OrganizationType;

  status: OrganizationStatus;

  verificationStatus: VerificationStatus;
};

/* =========================================================
   Location
========================================================= */

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

  status:
    | "active"
    | "inactive"
    | "archived";
};

/* =========================================================
   Translation
========================================================= */

export type ServiceTranslation = {
  title: string;

  description: string;

  eligibility?: string;
};

export type ServiceTranslations = {
  es?: ServiceTranslation;

  eu?: ServiceTranslation;

  ar?: ServiceTranslation;

  en?: ServiceTranslation;
};

/* =========================================================
   Delivery Mode
========================================================= */

export type ServiceDeliveryMode =
  | "in_person"
  | "online"
  | "phone"
  | "mobile"
  | "hybrid";

/* =========================================================
   Status
========================================================= */

export type ServiceStatus =
  | "draft"
  | "active"
  | "inactive"
  | "archived";

/* =========================================================
   Cost
========================================================= */

export type ServiceCostType =
  | "free"
  | "paid"
  | "subsidized"
  | "unknown";

/* =========================================================
   Service
========================================================= */

export type Service = {
  _id: string;

  organizationId:
    EntityReference<ServiceOrganizationSummary>;

  locationIds: Array<
    string |
    ServiceLocationSummary
  >;

  categoryId:
    EntityReference<ServiceCategorySummary>;

  needIds: Array<
    string |
    Need
  >;

  translations?: ServiceTranslations;

  /*
   * Legacy / fallback fields.
   */
  title: string;

  description: string;

  eligibility?: string;

  deliveryModes:
    ServiceDeliveryMode[];

  requiredDocuments:
    string[];

  costType:
    ServiceCostType;

  appointmentRequired:
    boolean;

  website?: string;

  phone?: string;

  email?: string;

  languages:
    string[];

  verificationStatus:
    VerificationStatus;

  status:
    ServiceStatus;

  category?: string;

  municipality?: string;

  territory?: string;

  address?: string;

  verified?: boolean;

  createdAt?: string;

  updatedAt?: string;
};

/* =========================================================
   Public Filters
========================================================= */

export type ServiceFilters = {
  organizationId?: string;

  categoryId?: string;

  locationId?: string;

  needId?: string;

  q?: string;
};

/* =========================================================
   Managed Filters
========================================================= */

export type ManagedServiceFilters =
  ServiceFilters & {
    status?: ServiceStatus;
  };

/* =========================================================
   Create / Update
========================================================= */

export type CreateServiceInput = {
  organizationId: string;

  locationIds?: string[];

  categoryId: string;

  needIds?: string[];

  translations?: ServiceTranslations;

  /*
   * Kept during frontend
   * migration.
   */
  title: string;

  description: string;

  eligibility?: string;

  deliveryModes?:
    ServiceDeliveryMode[];

  requiredDocuments?: string[];

  costType?:
    ServiceCostType;

  appointmentRequired?: boolean;

  website?: string;

  phone?: string;

  email?: string;

  languages?: string[];
};

/* =========================================================
   Query helper
========================================================= */

function withQuery(
  path: string,
  values: object
) {
  const search =
    new URLSearchParams();

  Object.entries(
    values
  ).forEach(
    ([key, value]) => {
      if (
        typeof value ===
          "string" &&
        value
      ) {
        search.set(
          key,
          value
        );
      }
    }
  );

  const query =
    search.toString();

  return query
    ? `${path}?${query}`
    : path;
}

/* =========================================================
   Categories API
========================================================= */

export const serviceCategoriesService =
  {
    list(
      status: ServiceCategoryStatus =
        "active"
    ) {
      return http<
        ServiceCategory[]
      >(
        withQuery(
          "/service-categories",
          {
            status,
          }
        )
      );
    },
  };

/* =========================================================
   Services API
========================================================= */

export const servicesService = {
  list(
    filters: ServiceFilters =
      {}
  ) {
    return http<Service[]>(
      withQuery(
        "/services",
        filters
      )
    );
  },

  listMine(
    filters: ManagedServiceFilters =
      {}
  ) {
    return http<Service[]>(
      withQuery(
        "/services/mine",
        filters
      )
    );
  },

  getMineById(
    id: string
  ) {
    return http<Service>(
      `/services/mine/${id}`
    );
  },

  getById(
    id: string
  ) {
    return http<Service>(
      `/services/${id}`
    );
  },

  create(
    data: CreateServiceInput
  ) {
    return http<Service>(
      "/services",
      {
        method: "POST",

        body:
          JSON.stringify(
            data
          ),
      }
    );
  },

  update(
    id: string,

    data: Partial<CreateServiceInput>
  ) {
    return http<Service>(
      `/services/${id}`,
      {
        method: "PUT",

        body:
          JSON.stringify(
            data
          ),
      }
    );
  },

  remove(
    id: string
  ) {
    return http<Service>(
      `/services/${id}`,
      {
        method:
          "DELETE",
      }
    );
  },
};