import { http } from "./api";
import type {
  EntityReference,
  OrganizationStatus,
  VerificationStatus,
} from "./organizations.service";
import type { MunicipalitySummary } from "./organization-locations.service";

export type PublicationType =
  | "announcement"
  | "need"
  | "offer"
  | "event"
  | "resource";

export type PublicationUrgency = "normal" | "urgent" | "critical";

export type PublicationStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "expired"
  | "rejected"
  | "hidden"
  | "archived";

export type PublicationCategoryStatus = "active" | "inactive" | "archived";

export type PublicationCategorySummary = {
  _id: string;
  code: string;
  name: string;
  allowedTypes?: PublicationType[];
  status?: PublicationCategoryStatus;
};

export type PublicationCategory = PublicationCategorySummary & {
  description?: string;
  parentCategoryId?: EntityReference<PublicationCategorySummary>;
  allowedTypes: PublicationType[];
  sortOrder: number;
  status: PublicationCategoryStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type PublicationUserSummary = {
  _id: string;
  fullName?: string;
  displayName?: string;
  profileImage?: string;
  status?: string;
};

export type PublicationOrganizationSummary = {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  status: OrganizationStatus;
  verificationStatus: VerificationStatus;
};

export type Publication = {
  _id: string;
  authorUserId?: EntityReference<PublicationUserSummary>;
  organizationId?: EntityReference<PublicationOrganizationSummary>;
  municipalityId: EntityReference<MunicipalitySummary>;
  categoryId: EntityReference<PublicationCategorySummary>;
  type: PublicationType;
  title: string;
  description: string;
  sourceLanguage: string;
  urgency: PublicationUrgency;
  contactMethod:
    | "platform"
    | "email"
    | "phone"
    | "whatsapp"
    | "external_url";
  contactValue?: string;
  verificationStatus: VerificationStatus;
  status: PublicationStatus;
  publishedAt?: string;
  expiresAt?: string | null;
  reviewedByUserId?: EntityReference<PublicationUserSummary>;
  reviewedAt?: string;
  createdAt: string;
  updatedAt?: string;
};

export type PublicationAttachment = {
  _id: string;
  publicationId: string;
  uploadedByUserId: string;
  kind: "image" | "document";
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  publicUrl?: string;
  status: "pending" | "active" | "rejected" | "archived";
  createdAt?: string;
  updatedAt?: string;
};

export type PublicationDetails = {
  publication: Publication;
  attachments: PublicationAttachment[];
};

export type PublicationFilters = {
  municipalityId?: string;
  categoryId?: string;
  organizationId?: string;
  authorUserId?: string;
  type?: PublicationType;
  urgency?: PublicationUrgency;
  q?: string;
};

export type CreatePublicationInput = {
  organizationId?: string;
  municipalityId: string;
  categoryId: string;
  type: PublicationType;
  title: string;
  description: string;
  sourceLanguage?: string;
  urgency?: PublicationUrgency;
  contactMethod?: Publication["contactMethod"];
  contactValue?: string;
  expiresAt?: string | null;
};

function withQuery(path: string, values: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const query = search.toString();
  return query ? path + "?" + query : path;
}

export const publicationCategoriesService = {
  list() {
    return http<PublicationCategory[]>("/publication-categories");
  },
};

export const publicationsService = {
  list(filters: PublicationFilters = {}) {
    return http<Publication[]>(
      withQuery("/publications", filters)
    );
  },

  getById(id: string) {
    return http<PublicationDetails>("/publications/" + id);
  },

  create(data: CreatePublicationInput) {
    return http<Publication>("/publications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: Partial<CreatePublicationInput>) {
    return http<Publication>("/publications/" + id, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  remove(id: string) {
    return http<Publication>("/publications/" + id, {
      method: "DELETE",
    });
  },
};
