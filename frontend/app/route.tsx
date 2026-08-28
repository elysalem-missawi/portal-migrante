import { createBrowserRouter, Navigate } from "react-router-dom";
import Root from "./root";
import OfficeLayout from "./components/office/OfficeLayout";
import Home from "./routes/home";
import Servicios from "./routes/servicios";
import Users from "./routes/users";
import NewUser from "./routes/users.new";
import LoginUser from "./routes/users.login";
import Contacto from "./routes/contacto";
import Sobre from "./routes/sobre";
import Anuncios from "./routes/anuncios";
import Observatorio from "./routes/observatorio";
import AyuntamientosPage from "./routes/ayuntamientos";
import OrganizationsPage from "./routes/organizations";
import NewOrganizationPage from "./routes/organizations.new";
import ServiceInfoPage from "./routes/service-info";
import AsociacionesPage from "./routes/asociaciones";
import ForoMigrantesPage from "./routes/foro";
import CulturaVascaPage from "./routes/cultura-vasca";
import LegalTermsPage from "./routes/legal-terms";
import ProtectedOfficeRoute from "./routes/guards/ProtectedOfficeRoute";
import OfficeDashboard from "./routes/office/OfficeDashboard";
import OfficeTasks from "./routes/office/OfficeTasks";
import OfficeMeetings from "./routes/office/OfficeMeetings";
import OfficeProjects from "./routes/office/OfficeProjects";
import OfficeFunding from "./routes/office/OfficeFunding";
import OfficeDocuments from "./routes/office/OfficeDocuments";
import OfficePlaceholder from "./routes/office/OfficePlaceholder";
import UnauthorizedPage from "./routes/office/Unauthorized";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "servicios", element: <Servicios /> },
      { path: "servicios/salud", element: <ServiceInfoPage serviceId="salud" /> },
      { path: "servicios/vivienda", element: <ServiceInfoPage serviceId="vivienda" /> },
      { path: "servicios/empleo", element: <ServiceInfoPage serviceId="empleo" /> },
      { path: "servicios/educacion", element: <ServiceInfoPage serviceId="educacion" /> },
      { path: "servicios/legal", element: <ServiceInfoPage serviceId="legal" /> },
      { path: "servicios/asociaciones", element: <AsociacionesPage /> },
      { path: "foro", element: <ForoMigrantesPage /> },
      { path: "cultura-vasca", element: <CulturaVascaPage /> },
      { path: "anuncios", element: <Anuncios /> },
      { path: "observatorio", element: <Observatorio /> },
      { path: "sobre", element: <Sobre /> },
      { path: "contacto", element: <Contacto /> },
      { path: "condiciones", element: <LegalTermsPage /> },
      { path: "users", element: <Users /> },
      { path: "users/new", element: <NewUser /> },
      { path: "users/login", element: <LoginUser /> },
      { path: "login", element: <LoginUser /> },
      { path: "unauthorized", element: <UnauthorizedPage /> },
      { path: "organizations", element: <OrganizationsPage /> },
      { path: "organizations/new", element: <NewOrganizationPage /> },
      { path: "ayuntamientos", element: <AyuntamientosPage /> },
    ],
  },
  {
    path: "/office",
    element: (
      <ProtectedOfficeRoute>
        <OfficeLayout />
      </ProtectedOfficeRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/office/dashboard" replace /> },
      { path: "dashboard", element: <OfficeDashboard /> },
      { path: "tasks", element: <OfficeTasks /> },
      { path: "meetings", element: <OfficeMeetings /> },
      { path: "projects", element: <OfficeProjects /> },
      { path: "funding", element: <OfficeFunding /> },
      { path: "documents", element: <OfficeDocuments /> },
      { path: "members", element: <OfficePlaceholder titleEs="Miembros" titleAr="الأعضاء" /> },
      { path: "volunteers", element: <OfficePlaceholder titleEs="Voluntariado" titleAr="المتطوعون" /> },
      { path: "finance", element: <OfficePlaceholder titleEs="Finanzas" titleAr="المالية" /> },
      { path: "contacts", element: <OfficePlaceholder titleEs="Contactos" titleAr="الاتصالات" /> },
      { path: "activities", element: <OfficePlaceholder titleEs="Actividades" titleAr="الأنشطة" /> },
      { path: "reports", element: <OfficePlaceholder titleEs="Informes" titleAr="التقارير" /> },
      { path: "settings", element: <OfficePlaceholder titleEs="Ajustes" titleAr="الإعدادات" /> },
    ],
  },
]);

export default router;
