import { Router } from "express";
import healthRoutes from "./health.routes";
import faqRoutes from "../modules/faq/routes/faq.routes";

const router = Router();

router.use("/", healthRoutes);

router.use("/faq", faqRoutes);

export default router;