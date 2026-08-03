import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { validateBody } from "../../../middlewares/validate.middleware";
import { askQuestionSchema } from "../dto/ask-question.dto";

const router = Router();

router.post("/", validateBody(askQuestionSchema), ChatController.ask);
router.get("/history", ChatController.history);

export default router;
