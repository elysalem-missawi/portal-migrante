import { Router } from "express";
import {
  getMunicipalities,
  getMunicipalityDetails,
} from "../controllers/municipality.controller";

const router = Router();

router.get("/", getMunicipalities);
router.get("/:idOrSlug", getMunicipalityDetails);

export default router;
