import { Router } from "express";
import {
  getMe,
  login,
  logout,
  refresh,
  register,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", authenticate, getMe);

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
