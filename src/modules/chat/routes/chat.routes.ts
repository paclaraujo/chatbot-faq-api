import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";

const router = Router();

router.post("/", ChatController.ask);
router.get("/history", ChatController.history);

export default router;
