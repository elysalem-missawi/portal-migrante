import { Router } from "express";
import { createReport, getReports, updateReport } from "../controllers/report.controller";
import requireWriteAccess from "../middlewares/requireWriteAccess";

const router = Router();

router.use(requireWriteAccess);
router.route("/").get(getReports).post(createReport);
router.put("/:id", updateReport);

export default router;
