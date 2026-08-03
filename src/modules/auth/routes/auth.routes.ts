import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateBody } from "../../../middlewares/validate.middleware";
import { loginSchema } from "../dto/login.dto";

const router = Router();

router.post("/login", validateBody(loginSchema), AuthController.login);

export default router;
