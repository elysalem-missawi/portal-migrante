import { Router } from "express";
import {
  createOrganizationMember,
  endOrganizationMembership,
  getOrganizationMembers,
  updateOrganizationMember,
} from "../controllers/organizationMember.controller";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.use(requireAuth);
router.route("/").get(getOrganizationMembers).post(createOrganizationMember);
router.route("/:id").put(updateOrganizationMember).delete(endOrganizationMembership);

export default router;
