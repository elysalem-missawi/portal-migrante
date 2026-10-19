import { Link } from "react-router-dom";

const quickLinks = [
  { to: "/servicios/salud", label: "Salud", description: "Centros sanitarios y atención básica" },
  { to: "/servicios/vivienda", label: "Vivienda", description: "Alquiler, ayudas y recursos públicos" },
  { to: "/servicios/educacion", label: "Educación", description: "Formación, idiomas y universidades" },
  { to: "/servicios/legal", label: "Legal", description: "Trámites, derechos y asesoramiento" },
];

export function Welcome() {
  return (
    <main className="min-h-screen bg-neutral-background">
      <section className="bg-vitoria-gradient text-white">
        <div className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-8">
              <p className="text-uppercase small fw-semibold opacity-75 mb-2">
                Portal Migrante Euskadi
              </p>
              <h1 className="display-5 fw-bold mb-3">
                Información clara para empezar en el País Vasco
              </h1>
              <p className="lead mb-4">
                Encuentra servicios de salud, vivienda, educación y orientación legal en un solo lugar.
              </p>
              <Link to="/servicios" className="btn btn-light fw-semibold">
                Explorar servicios
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-3">
          {quickLinks.map((item) => (
            <div key={item.to} className="col-12 col-md-6 col-xl-3">
              <Link to={item.to} className="card h-100 border-0 shadow-sm text-decoration-none">
                <div className="card-body">
                  <h2 className="h5 fw-bold text-dark mb-2">{item.label}</h2>
                  <p className="text-secondary small mb-0">{item.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
