import { Router } from "express";
import {
  createOrganizationMember,
  endOrganizationMembership,
  getOrganizationMembers,
  updateOrganizationMember,
} from "../controllers/organizationMember.controller";
import requireWriteAccess from "../middlewares/requireWriteAccess";

const router = Router();

router.use(requireWriteAccess);
router.route("/").get(getOrganizationMembers).post(createOrganizationMember);
router
  .route("/:id")
  .put(updateOrganizationMember)
  .delete(endOrganizationMembership);

export default router;
