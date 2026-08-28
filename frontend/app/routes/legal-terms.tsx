import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

export default function LegalTermsPage() {
  const { t } = useI18n();

  const points = [
    "legal_terms_point_1",
    "legal_terms_point_2",
    "legal_terms_point_3",
    "legal_terms_point_4",
  ];

  return (
    <section className="bg-light py-5">
      <div className="container">
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          <Link to="/users/new" className="btn btn-outline-secondary rounded-pill mb-4">
            {t("legal_terms_back")}
          </Link>

          <div className="rounded-3 border bg-white p-4 p-lg-5 shadow-sm">
            <p className="text-success fw-semibold mb-2">{t("portal_brand")}</p>
            <h1 className="display-6 fw-bold mb-3">{t("legal_terms_title")}</h1>
            <p className="lead text-secondary mb-4">{t("legal_terms_subtitle")}</p>
            <p className="fs-5 text-secondary">{t("legal_terms_intro")}</p>

            <div className="d-grid gap-3 mt-4">
              {points.map((key, index) => (
                <div key={key} className="rounded-3 border bg-light p-3">
                  <div className="small fw-bold text-success mb-1">
                    0{index + 1}
                  </div>
                  <div className="text-dark">{t(key)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
