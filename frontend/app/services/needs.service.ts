import { http } from "./api";

export type NeedStatus =
  | "active"
  | "inactive";

export type NeedLabels = {
  es: string;
  eu?: string;
  ar?: string;
  en?: string;
};

export type NeedDescriptions = {
  es?: string;
  eu?: string;
  ar?: string;
  en?: string;
};

export type Need = {
  _id: string;

  code: string;

  labels: NeedLabels;

  descriptions: NeedDescriptions;

  order: number;

  status: NeedStatus;

  createdAt?: string;
  updatedAt?: string;
};

export const needsService = {
  list(
    status: NeedStatus = "active"
  ) {
    return http<Need[]>(
      `/needs?status=${status}`
    );
  },

  getById(id: string) {
    return http<Need>(
      `/needs/${id}`
    );
  },
};