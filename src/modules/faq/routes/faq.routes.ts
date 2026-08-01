import { Router } from "express";
import { FaqController } from "../controllers/faq.controller";

const router = Router();

router.get("/", FaqController.list);
router.post("/", FaqController.create);

export default router;