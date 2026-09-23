import { Router } from "express";
import {
  createService,
  getServices,
  getMyServices,
  getMyServiceById,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/services.controller";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/mine", requireAuth, getMyServices);
router.get("/mine/:id", requireAuth, getMyServiceById);
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
