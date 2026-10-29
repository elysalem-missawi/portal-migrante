import { http } from "./api";

import type { Need } from "./needs.service";

export type ContentItemType =
  | "information"
  | "guide"
  | "external_resource";

export type ContentItemStatus =
  | "draft"
  | "active"
  | "inactive";

export type ContentTranslation = {
  title: string;
  summary?: string;
  content?: string;
};

export type GuideStepTranslation = {
  title?: string;
  content?: string;
};

export type GuideStep = {
  order: number;

  translations: {
    es: GuideStepTranslation;
    eu?: GuideStepTranslation;
    ar?: GuideStepTranslation;
    en?: GuideStepTranslation;
  };
};

export type ResourceData = {
  url?: string;
  phone?: string;
  email?: string;
  contactText?: string;
};

export type ContentSource = {
  name: string;
  url?: string;
};

export type ContentItem = {
  _id: string;

  type: ContentItemType;

  needIds: Array<
    | string
    | Need
  >;

  translations: {
    es: ContentTranslation;
    eu?: ContentTranslation;
    ar?: ContentTranslation;
    en?: ContentTranslation;
  };

  steps?: GuideStep[];

  resourceData?: ResourceData;

  source: ContentSource;

  order: number;

  status: ContentItemStatus;

  createdAt?: string;
  updatedAt?: string;
};

export const contentItemsService = {
  list(params?: {
    needId?: string;
    type?: ContentItemType;
  }) {
    const search =
      new URLSearchParams();

    if (params?.needId) {
      search.set(
        "needId",
        params.needId
      );
    }

    if (params?.type) {
      search.set(
        "type",
        params.type
      );
    }

    const query =
      search.toString();

    return http<ContentItem[]>(
      `/content-items${
        query
          ? `?${query}`
          : ""
      }`
    );
  },

  getById(id: string) {
    return http<ContentItem>(
      `/content-items/${id}`
    );
  },
};