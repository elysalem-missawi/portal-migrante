import { Router } from "express";
import {
  createService,
  getServices,
  getMyServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/services.controller";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/mine", requireAuth, getMyServices);
router
  .route("/")
  .get(getServices)
  .post(requireAuth, createService);
router
  .route("/:id")
  .get(getServiceById)
  .put(requireAuth, updateService)
  .delete(requireAuth, deleteService);

export default router;
