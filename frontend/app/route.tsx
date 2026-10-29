import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import {
  lazy,
} from "react";

import Root from "./root";

import OfficeLayout from "./components/office/OfficeLayout";

import ProtectedAuthenticatedRoute from "./routes/guards/ProtectedAuthenticatedRoute";

import ProtectedPlatformStaffRoute from "./routes/guards/ProtectedPlatformStaffRoute";

import ProtectedOfficeRoute from "./routes/guards/ProtectedOfficeRoute";

import OfficeDashboard from "./routes/office/OfficeDashboard";

import OfficeTasks from "./routes/office/OfficeTasks";

import OfficeMeetings from "./routes/office/OfficeMeetings";

import OfficeProjects from "./routes/office/OfficeProjects";

import OfficeFunding from "./routes/office/OfficeFunding";

import OfficeDocuments from "./routes/office/OfficeDocuments";

import OfficePlaceholder from "./routes/office/OfficePlaceholder";

import UnauthorizedPage from "./routes/office/Unauthorized";

/* =========================================================
   Public / community pages
========================================================= */

const Home =
  lazy(
    () =>
      import(
        "./routes/home"
      )
  );

const NeedsPage =
  lazy(
    () =>
      import(
        "./routes/needs"
      )
  );

const NeedDetailPage =
  lazy(
    () =>
      import(
        "./routes/need-detail"
      )
  );

const Servicios =
  lazy(
    () =>
      import(
        "./routes/servicios"
      )
  );

const Contacto =
  lazy(
    () =>
      import(
        "./routes/contacto"
      )
  );

const Sobre =
  lazy(
    () =>
      import(
        "./routes/sobre"
      )
  );

const Anuncios =
  lazy(
    () =>
      import(
        "./routes/anuncios"
      )
  );

const Observatorio =
  lazy(
    () =>
      import(
        "./routes/observatorio"
      )
  );

const AyuntamientosPage =
  lazy(
    () =>
      import(
        "./routes/ayuntamientos"
      )
  );

const AsociacionesPage =
  lazy(
    () =>
      import(
        "./routes/asociaciones"
      )
  );

const ForoMigrantesPage =
  lazy(
    () =>
      import(
        "./routes/foro"
      )
  );

const CulturaVascaPage =
  lazy(
    () =>
      import(
        "./routes/cultura-vasca"
      )
  );

const LegalTermsPage =
  lazy(
    () =>
      import(
        "./routes/legal-terms"
      )
  );

/* =========================================================
   Support
========================================================= */

const SupportRequestNewPage =
  lazy(
    () =>
      import(
        "./routes/support-request-new"
      )
  );
  const SupportRequestsMyPage = lazy(
  () => import("./routes/support-requests-my")
);

/* =========================================================
   Users
========================================================= */

const Users =
  lazy(
    () =>
      import(
        "./routes/users"
      )
  );

const NewUser =
  lazy(
    () =>
      import(
        "./routes/users.new"
      )
  );

const LoginUser =
  lazy(
    () =>
      import(
        "./routes/users.login"
      )
  );

const UserProfile =
  lazy(
    () =>
      import(
        "./routes/users.profile"
      )
  );

/* =========================================================
   Organizations
========================================================= */

const OrganizationsPage =
  lazy(
    () =>
      import(
        "./routes/organizations"
      )
  );

const NewOrganizationPage =
  lazy(
    () =>
      import(
        "./routes/organizations.new"
      )
  );

const OrganizationManagePage =
  lazy(
    () =>
      import(
        "./routes/organizations.manage"
      )
  );

const OrganizationServiceFormPage =
  lazy(
    () =>
      import(
        "./routes/organizations.service-form"
      )
  );

/* =========================================================
   Services
========================================================= */

const ServiceInfoPage =
  lazy(
    () =>
      import(
        "./routes/service-info"
      )
  );

const ServiceDetailPage =
  lazy(
    () =>
      import(
        "./routes/service-detail"
      )
  );

/* =========================================================
   Administration
========================================================= */

const AdminModerationPage =
  lazy(
    () =>
      import(
        "./routes/admin.moderation"
      )
  );

/* =========================================================
   Router
========================================================= */

const router =
  createBrowserRouter([
    {
      path:
        "/",

      element:
        <Root />,

      children: [
        /* ===================================================
           HOME
        =================================================== */

        {
          index:
            true,

          element:
            <Home />,
        },

        /* ===================================================
           NEEDS
        =================================================== */

        {
          path:
            "necesidades",

          element:
            <NeedsPage />,
        },

        {
          path:
            "necesidades/:id",

          element:
            <NeedDetailPage />,
        },

        /* ===================================================
           SUPPORT
        =================================================== */

        {
          path:
            "support/new",

          element: (
            <ProtectedAuthenticatedRoute>
              <SupportRequestNewPage />
            </ProtectedAuthenticatedRoute>
          ),
        },
        {
  path: "support/my",
  element: (
    <ProtectedAuthenticatedRoute>
      <SupportRequestsMyPage />
    </ProtectedAuthenticatedRoute>
  ),
},

        /* ===================================================
           SERVICES
        =================================================== */

        {
          path:
            "servicios",

          element:
            <Servicios />,
        },

        {
          path:
            "servicios/salud",

          element: (
            <ServiceInfoPage
              serviceId="salud"
            />
          ),
        },

        {
          path:
            "servicios/vivienda",

          element: (
            <ServiceInfoPage
              serviceId="vivienda"
            />
          ),
        },

        {
          path:
            "servicios/empleo",

          element: (
            <ServiceInfoPage
              serviceId="empleo"
            />
          ),
        },

        {
          path:
            "servicios/educacion",

          element: (
            <ServiceInfoPage
              serviceId="educacion"
            />
          ),
        },

        {
          path:
            "servicios/legal",

          element: (
            <ServiceInfoPage
              serviceId="legal"
            />
          ),
        },

        {
          path:
            "servicios/asociaciones",

          element:
            <AsociacionesPage />,
        },

        {
          path:
            "servicios/:id/detalle",

          element:
            <ServiceDetailPage />,
        },

        /* ===================================================
           COMMUNITY
        =================================================== */

        {
          path:
            "foro",

          element:
            <ForoMigrantesPage />,
        },

        {
          path:
            "cultura-vasca",

          element:
            <CulturaVascaPage />,
        },

        {
          path:
            "anuncios",

          element:
            <Anuncios />,
        },

        {
          path:
            "observatorio",

          element:
            <Observatorio />,
        },

        {
          path:
            "sobre",

          element:
            <Sobre />,
        },

        {
          path:
            "contacto",

          element:
            <Contacto />,
        },

        {
          path:
            "condiciones",

          element:
            <LegalTermsPage />,
        },

        /* ===================================================
           USERS
        =================================================== */

        {
          path:
            "users",

          element: (
            <ProtectedPlatformStaffRoute>
              <Users />
            </ProtectedPlatformStaffRoute>
          ),
        },

        {
          path:
            "users/new",

          element:
            <NewUser />,
        },

        {
          path:
            "users/login",

          element:
            <LoginUser />,
        },

        {
          path:
            "login",

          element:
            <LoginUser />,
        },

        {
          path:
            "profile",

          element: (
            <ProtectedAuthenticatedRoute>
              <UserProfile />
            </ProtectedAuthenticatedRoute>
          ),
        },

        {
          path:
            "unauthorized",

          element:
            <UnauthorizedPage />,
        },

        /* ===================================================
           ADMIN
        =================================================== */

        {
          path:
            "admin/moderation",

          element: (
            <ProtectedPlatformStaffRoute>
              <AdminModerationPage />
            </ProtectedPlatformStaffRoute>
          ),
        },

        /* ===================================================
           ORGANIZATIONS
        =================================================== */

        {
          path:
            "organizations",

          element: (
            <ProtectedAuthenticatedRoute>
              <OrganizationsPage />
            </ProtectedAuthenticatedRoute>
          ),
        },

        {
          path:
            "organizations/new",

          element: (
            <ProtectedAuthenticatedRoute>
              <NewOrganizationPage />
            </ProtectedAuthenticatedRoute>
          ),
        },

        {
          path:
            "organizations/:id/manage",

          element: (
            <ProtectedAuthenticatedRoute>
              <OrganizationManagePage />
            </ProtectedAuthenticatedRoute>
          ),
        },

        {
          path:
            "organizations/:id/services/new",

          element: (
            <ProtectedAuthenticatedRoute>
              <OrganizationServiceFormPage />
            </ProtectedAuthenticatedRoute>
          ),
        },

        {
          path:
            "organizations/:id/services/:serviceId/edit",

          element: (
            <ProtectedAuthenticatedRoute>
              <OrganizationServiceFormPage />
            </ProtectedAuthenticatedRoute>
          ),
        },

        /* ===================================================
           MUNICIPALITIES
        =================================================== */

        {
          path:
            "ayuntamientos",

          element:
            <AyuntamientosPage />,
        },
      ],
    },

    /* =======================================================
       OFFICE
    ======================================================= */

    {
      path:
        "/office",

      element: (
        <ProtectedOfficeRoute>
          <OfficeLayout />
        </ProtectedOfficeRoute>
      ),

      children: [
        {
          index:
            true,

          element: (
            <Navigate
              to="/office/dashboard"
              replace
            />
          ),
        },

        {
          path:
            "dashboard",

          element:
            <OfficeDashboard />,
        },

        {
          path:
            "tasks",

          element:
            <OfficeTasks />,
        },

        {
          path:
            "meetings",

          element:
            <OfficeMeetings />,
        },

        {
          path:
            "projects",

          element:
            <OfficeProjects />,
        },

        {
          path:
            "funding",

          element:
            <OfficeFunding />,
        },

        {
          path:
            "documents",

          element:
            <OfficeDocuments />,
        },

        {
          path:
            "members",

          element: (
            <OfficePlaceholder
              titleEs="Miembros"
              titleAr="الأعضاء"
            />
          ),
        },

        {
          path:
            "volunteers",

          element: (
            <OfficePlaceholder
              titleEs="Voluntariado"
              titleAr="المتطوعون"
            />
          ),
        },

        {
          path:
            "finance",

          element: (
            <OfficePlaceholder
              titleEs="Finanzas"
              titleAr="المالية"
            />
          ),
        },

        {
          path:
            "contacts",

          element: (
            <OfficePlaceholder
              titleEs="Contactos"
              titleAr="الاتصالات"
            />
          ),
        },

        {
          path:
            "activities",

          element: (
            <OfficePlaceholder
              titleEs="Actividades"
              titleAr="الأنشطة"
            />
          ),
        },

        {
          path:
            "reports",

          element: (
            <OfficePlaceholder
              titleEs="Informes"
              titleAr="التقارير"
            />
          ),
        },

        {
          path:
            "settings",

          element: (
            <OfficePlaceholder
              titleEs="Ajustes"
              titleAr="الإعدادات"
            />
          ),
        },
      ],
    },
  ]);

export default router;