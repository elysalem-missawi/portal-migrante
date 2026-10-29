import {
  Router,
} from "express";

import authRoute from "./auth.route";

import healthRoute from "./health.route";

import usersRoute from "./users.route";

import needsRoute from "./needs.route";

import contentItemsRoute from "./contentItems.route";

import servicesRoute from "./services.route";

import serviceCategoriesRoute from "./serviceCategories.route";

import organizationsRoute from "./organizations.route";

import organizationLocationsRoute from "./organizationLocations.route";

import organizationMembersRoute from "./organizationMembers.route";

import municipalitiesRoute from "./municipalities.route";

import publicationsRoute from "./publications.route";

import publicationCategoriesRoute from "./publicationCategories.route";

import publicationAttachmentsRoute from "./publicationAttachments.route";

import reportsRoute from "./reports.route";

import moderationActionsRoute from "./moderationActions.route";

import forumRoute from "./forum.route";

import supportRequestsRoute from "./supportRequests.route";

import helpOffersRoute from "./helpOffers.route";

const router =
  Router();

/* =========================================================
   Authentication
========================================================= */

router.use(
  "/auth",
  authRoute
);

/* =========================================================
   Health
========================================================= */

router.use(
  "/health",
  healthRoute
);

/* =========================================================
   Users
========================================================= */

router.use(
  "/users",
  usersRoute
);

/* =========================================================
   Needs
========================================================= */

router.use(
  "/needs",
  needsRoute
);

/* =========================================================
   Content
========================================================= */

router.use(
  "/content-items",
  contentItemsRoute
);

/* =========================================================
   Services
========================================================= */

router.use(
  "/services",
  servicesRoute
);

router.use(
  "/service-categories",
  serviceCategoriesRoute
);

/* =========================================================
   Organizations
========================================================= */

router.use(
  "/organizations",
  organizationsRoute
);

router.use(
  "/organization-locations",
  organizationLocationsRoute
);

router.use(
  "/organization-members",
  organizationMembersRoute
);

/* =========================================================
   Municipalities
========================================================= */

router.use(
  "/municipalities",
  municipalitiesRoute
);

/* =========================================================
   Publications
========================================================= */

router.use(
  "/publications",
  publicationsRoute
);

router.use(
  "/publication-categories",
  publicationCategoriesRoute
);

router.use(
  "/publication-attachments",
  publicationAttachmentsRoute
);

/* =========================================================
   Community
========================================================= */

router.use(
  "/forum",
  forumRoute
);

/* =========================================================
   Support
========================================================= */

router.use(
  "/support-requests",
  supportRequestsRoute
);

/* =========================================================
   Help offers
========================================================= */

router.use(
  "/help-offers",
  helpOffersRoute
);

/* =========================================================
   Reports / moderation
========================================================= */

router.use(
  "/reports",
  reportsRoute
);

router.use(
  "/moderation-actions",
  moderationActionsRoute
);

export default router;
