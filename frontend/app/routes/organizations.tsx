import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  organizationsService,
  type Organization,
} from "../services/organizations.service";
import { useI18n } from "../i18n";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useI18n();

  const getTypeLabel = (value: string) => t(`organization_type_${value}`);
  const getStatusLabel = (value: string) => t(`status_${value}`);

  useEffect(() => {
    organizationsService
      .list()
      .then(setOrganizations)
      .catch((err) => setError(err.message || t("organization_load_error")))
      .finally(() => setLoading(false));
  }, [t]);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 m-0">{t("organization_plural")}</h1>
        <Link to="/organizations/new" className="btn btn-dark">
          + {t("organization_new")}
        </Link>
      </div>

      {loading ? (
        <div className="text-muted">{t("loading")}</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : organizations.length ? (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>{t("name")}</th>
                <th>{t("type")}</th>
                <th>{t("email")}</th>
                <th>{t("phone")}</th>
                <th>{t("status")}</th>
                <th>{t("verified")}</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org._id}>
                  <td className="fw-medium">{org.name}</td>
                  <td>{getTypeLabel(org.type) || org.type}</td>
                  <td>{org.email || "-"}</td>
                  <td>{org.phone || "-"}</td>
                  <td>{getStatusLabel(org.status) || org.status}</td>
                  <td>{org.verified ? t("yes") : t("no")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-muted">{t("no_data")}</div>
      )}
    </div>
  );
}
