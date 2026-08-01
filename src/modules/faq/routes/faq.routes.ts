import { Router } from "express";
import { FaqController } from "../controllers/faq.controller";

const router = Router();

router.get("/", FaqController.list);
router.post("/", FaqController.create);
router.patch("/:id", FaqController.update);
router.delete("/:id", FaqController.delete);

export default router;