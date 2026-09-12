import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  organizationsService,
  type Organization,
} from "../services/organizations.service";
import {
  organizationLocationsService,
  referenceId,
  type OrganizationLocation,
} from "../services/organization-locations.service";
import { useI18n } from "../i18n";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [locations, setLocations] = useState<OrganizationLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useI18n();

  const getTypeLabel = (value: string) => t("organization_type_" + value);
  const getStatusLabel = (value: string) => t("status_" + value);
  const getVerificationLabel = (organization: Organization) => {
    if (organization.verificationStatus === "verified" || organization.verified) {
      return t("yes");
    }
    if (organization.verificationStatus === "pending") {
      return t("status_pending");
    }
    return t("no");
  };

  useEffect(() => {
    let active = true;

    Promise.all([
      organizationsService.list(),
      organizationLocationsService.list({ status: "active" }),
    ])
      .then(([organizationItems, locationItems]) => {
        if (!active) return;
        setOrganizations(organizationItems);
        setLocations(locationItems);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message =
          err instanceof Error ? err.message : t("organization_load_error");
        setError(message || t("organization_load_error"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [t]);

  const primaryLocationByOrganization = useMemo(() => {
    const result = new Map<string, OrganizationLocation>();

    locations.forEach((location) => {
      const organizationId = referenceId(location.organizationId);
      if (!organizationId) return;

      const current = result.get(organizationId);
      if (!current || location.isHeadOffice) {
        result.set(organizationId, location);
      }
    });

    return result;
  }, [locations]);

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
              {organizations.map((organization) => {
                const primaryLocation = primaryLocationByOrganization.get(
                  organization._id
                );

                return (
                  <tr key={organization._id}>
                    <td className="fw-medium">{organization.name}</td>
                    <td>
                      {getTypeLabel(organization.type) || organization.type}
                    </td>
                    <td>
                      {primaryLocation?.email || organization.email || "-"}
                    </td>
                    <td>
                      {primaryLocation?.phone || organization.phone || "-"}
                    </td>
                    <td>
                      {getStatusLabel(organization.status) ||
                        organization.status}
                    </td>
                    <td>{getVerificationLabel(organization)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-muted">{t("no_data")}</div>
      )}
    </div>
  );
}
