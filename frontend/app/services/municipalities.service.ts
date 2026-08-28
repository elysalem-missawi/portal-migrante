// frontend/app/services/municipalities.service.ts
import { http } from "./api";

export type Municipality = {
  _id: string;
  name: string;
  slug: string;
  territory: "alava" | "bizkaia" | "gipuzkoa";
  municipio?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  population?: number;
  mayor?: string;
  party?: string;
  status?: string;
};

export const municipalitiesService = {
  async list() {
    return http<Municipality[]>("/municipalities");
  },

  async getBySlug(slug: string) {
    return http<Municipality>(`/municipalities/${slug}`);
  },
};
