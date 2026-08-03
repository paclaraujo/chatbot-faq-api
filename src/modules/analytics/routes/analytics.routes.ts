import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";
import { validateQuery } from "../../../middlewares/validate.middleware";
import { dashboardQuerySchema } from "../dto/dashboard-query.dto";

const router = Router();

router.get("/", validateQuery(dashboardQuerySchema), AnalyticsController.dashboard);

export default router;
