import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  organizationsService,
  type OrganizationStatus,
  type OrganizationType,
} from "../services/organizations.service";
import { useI18n } from "../i18n";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function NewOrganizationPage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const [formData, setFormData] = useState({
    type: "association" as OrganizationType,
    name: "",
    slug: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    languages: "es, ar",
    logo: "",
    verified: false,
    status: "pending" as OrganizationStatus,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]:
          type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : value,
      };

      if (name === "name" && !prev.slug) {
        next.slug = slugify(value);
      }

      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await organizationsService.create({
        type: formData.type,
        name: formData.name,
        slug: formData.slug || slugify(formData.name),
        description: formData.description || undefined,
        address: formData.address || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        website: formData.website || undefined,
        languages: formData.languages
          ? formData.languages.split(",").map((item) => item.trim()).filter(Boolean)
          : [],
        logo: formData.logo || undefined,
        verified: formData.verified,
        status: formData.status,
      });

      setSuccess(t("organization_create_success"));

      setTimeout(() => {
        navigate("/organizations");
      }, 700);
    } catch (err: any) {
      setError(err.message || t("organization_create_error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="h4 m-0">{t("organization_new_title")}</h1>
        <p className="text-muted mb-0">{t("organization_new_subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="card shadow-sm border-0">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">{t("type")}</label>
              <select
                name="type"
                className="form-select"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="municipality">{t("organization_type_municipality")}</option>
                <option value="health_center">{t("organization_type_health_center")}</option>
                <option value="association">{t("organization_type_association")}</option>
                <option value="social_services_office">{t("organization_type_social_services_office")}</option>
                <option value="employment_office">{t("organization_type_employment_office")}</option>
                <option value="legal_office">{t("organization_type_legal_office")}</option>
                <option value="education_center">{t("organization_type_education_center")}</option>
                <option value="community_center">{t("organization_type_community_center")}</option>
                <option value="other">{t("organization_type_other")}</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">{t("status")}</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">{t("status_active")}</option>
                <option value="inactive">{t("status_inactive")}</option>
                <option value="pending">{t("status_pending")}</option>
                <option value="archived">{t("status_archived")}</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">{t("name")}</label>
              <input
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">{t("slug")}</label>
              <input
                name="slug"
                className="form-control"
                value={formData.slug}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">{t("description")}</label>
              <textarea
                name="description"
                className="form-control"
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">{t("address")}</label>
              <input
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">{t("phone")}</label>
              <input
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">{t("email")}</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">{t("website")}</label>
              <input
                name="website"
                className="form-control"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">{t("languages")}</label>
              <input
                name="languages"
                className="form-control"
                value={formData.languages}
                onChange={handleChange}
                placeholder={t("languages_placeholder")}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">{t("logo_url")}</label>
              <input
                name="logo"
                className="form-control"
                value={formData.logo}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <div className="form-check">
                <input
                  id="verified"
                  type="checkbox"
                  name="verified"
                  className="form-check-input"
                  checked={formData.verified}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="verified">
                  {t("verified")}
                </label>
              </div>
            </div>
          </div>

          {error && <div className="alert alert-danger mt-4 mb-0">{error}</div>}
          {success && <div className="alert alert-success mt-4 mb-0">{success}</div>}
        </div>

        <div className="card-footer bg-white d-flex gap-2 justify-content-end">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/organizations")}
          >
            {t("cancel")}
          </button>
          <button type="submit" className="btn btn-dark" disabled={saving}>
            {saving ? t("saving") : t("create_organization")}
          </button>
        </div>
      </form>
    </div>
  );
}
