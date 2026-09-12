import { Router } from "express";
import healthRoute from "./health.route";
import usersRoute from "./users.route";
import servicesRoute from "./services.route";
import organizationsRoute from "./organizations.route";
import organizationLocationsRoute from "./organizationLocations.route";
import organizationMembersRoute from "./organizationMembers.route";
import municipalitiesRoute from "./municipalities.route";
import forumRoute from "./forum.route";

const router = Router();

router.use("/health", healthRoute);
router.use("/users", usersRoute);
router.use("/services", servicesRoute);
router.use("/organizations", organizationsRoute);
router.use("/organization-locations", organizationLocationsRoute);
router.use("/organization-members", organizationMembersRoute);
router.use("/municipalities", municipalitiesRoute);
router.use("/forum", forumRoute);

export default router;
