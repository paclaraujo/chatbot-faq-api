import { Router } from "express";
import healthRoutes from "./health.routes";
import faqRoutes from "../modules/faq/routes/faq.routes";
import chatRoutes from "../modules/chat/routes/chat.routes";

const router = Router();

router.use("/", healthRoutes);
router.use("/faq", faqRoutes);
router.use("/chat", chatRoutes);

export default router;