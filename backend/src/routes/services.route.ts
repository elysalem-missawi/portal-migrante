// src/routes/services.route.ts
import { Router } from "express";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/services.controller";
import requireWriteAccess from "../middlewares/requireWriteAccess";

const router = Router();

router.route("/").get(getServices).post(requireWriteAccess, createService);
router
  .route("/:id")
  .get(getServiceById)
  .put(requireWriteAccess, updateService)
  .delete(requireWriteAccess, deleteService);

export default router;
