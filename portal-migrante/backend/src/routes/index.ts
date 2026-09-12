import { Router } from "express";
import healthRoute from "./health.route";
import usersRoute from "./users.route";
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

const router = Router();

router.use("/health", healthRoute);
router.use("/users", usersRoute);
router.use("/services", servicesRoute);
router.use("/service-categories", serviceCategoriesRoute);
router.use("/organizations", organizationsRoute);
router.use("/organization-locations", organizationLocationsRoute);
router.use("/organization-members", organizationMembersRoute);
router.use("/municipalities", municipalitiesRoute);
router.use("/publications", publicationsRoute);
router.use("/publication-categories", publicationCategoriesRoute);
router.use("/publication-attachments", publicationAttachmentsRoute);
router.use("/reports", reportsRoute);
router.use("/moderation-actions", moderationActionsRoute);
router.use("/forum", forumRoute);

export default router;
