import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { usersService, type User } from "../services/users.service";
import { useI18n } from "../i18n";

function getOrganizationName(user: User): string {
  if (!user.organizationId) return "-";
  if (typeof user.organizationId === "string") return user.organizationId;
  return user.organizationId.name || "-";
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true); // ← حالة محلية
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const { t } = useI18n();

  const getAccountTypeLabel = (value: string) => t(`account_type_${value}`);
  const getRoleLabel = (value: string) => t(`role_${value}`);
  const getStatusLabel = (value: string) => t(`status_${value}`);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    usersService
      .list(q)
      .then((data) => {
        if (!cancelled) setUsers(data);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setUsers([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <div className="container py-4">
      {/* ... بقية الكود كما هو ... */}

      {loading ? (
        <div className="text-muted">{t("loading")}</div>
      ) : users.length ? (
        <table className="table table-hover align-middle">
          {/* ... الجدول كما هو ... */}
        </table>
      ) : (
        <div className="text-muted">{t("no_data")}</div>
      )}
    </div>
  );
}