// frontend/app/routes/observatorio.tsx
import { useI18n } from "../i18n";

export default function Observatorio() {
  const { t } = useI18n();

  return (
    <section className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2">{t("nav_observatory")}</h1>
            <a href="/" className="btn btn-outline-secondary">
              {t("back")}
            </a>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">{t("observatory_title")}</h3>
              <p className="card-text">{t("observatory_description")}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h4>{t("observatory_stats_title")}</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 text-center mb-3">
                  <div className="display-4 text-primary">📊</div>
                  <h5>{t("observatory_migration_stats")}</h5>
                  <p className="text-muted">{t("observatory_migration_desc")}</p>
                </div>
                <div className="col-md-4 text-center mb-3">
                  <div className="display-4 text-success">📈</div>
                  <h5>{t("observatory_integration_stats")}</h5>
                  <p className="text-muted">{t("observatory_integration_desc")}</p>
                </div>
                <div className="col-md-4 text-center mb-3">
                  <div className="display-4 text-warning">🔍</div>
                  <h5>{t("observatory_research_stats")}</h5>
                  <p className="text-muted">{t("observatory_research_desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5>{t("observatory_recent_reports")}</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 px-0">
                  <h6 className="mb-1">{t("observatory_report_1_title")}</h6>
                  <small className="text-muted">{t("observatory_report_1_date")}</small>
                </div>
                <div className="list-group-item border-0 px-0">
                  <h6 className="mb-1">{t("observatory_report_2_title")}</h6>
                  <small className="text-muted">{t("observatory_report_2_date")}</small>
                </div>
                <div className="list-group-item border-0 px-0">
                  <h6 className="mb-1">{t("observatory_report_3_title")}</h6>
                  <small className="text-muted">{t("observatory_report_3_date")}</small>
                </div>
              </div>
              <div className="mt-3">
                <button className="btn btn-primary btn-sm w-100">
                  {t("observatory_view_all_reports")}
                </button>
              </div>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header">
              <h5>{t("observatory_resources")}</h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" className="text-decoration-none">
                    📄 {t("observatory_resource_1")}
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none">
                    📊 {t("observatory_resource_2")}
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none">
                    🔬 {t("observatory_resource_3")}
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none">
                    📚 {t("observatory_resource_4")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}