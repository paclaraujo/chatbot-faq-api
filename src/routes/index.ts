import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "../modules/auth/routes/auth.routes";
import faqRoutes from "../modules/faq/routes/faq.routes";
import chatRoutes from "../modules/chat/routes/chat.routes";
import analyticsRoutes from "../modules/analytics/routes/analytics.routes";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use("/", healthRoutes);
router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/faq", authMiddleware, faqRoutes);
router.use("/analytics", authMiddleware, analyticsRoutes);

export default router;