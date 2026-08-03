import { Router } from "express";
import { FaqController } from "../controllers/faq.controller";
import { validateBody, validateParams } from "../../../middlewares/validate.middleware";
import { createFaqSchema, faqIdParamSchema, updateFaqSchema } from "../dto/create-faq.dto";

const router = Router();

router.get("/", FaqController.list);
router.post("/", validateBody(createFaqSchema), FaqController.create);
router.patch(
  "/:id",
  validateParams(faqIdParamSchema),
  validateBody(updateFaqSchema),
  FaqController.update
);
router.delete("/:id", validateParams(faqIdParamSchema), FaqController.delete);

export default router;
