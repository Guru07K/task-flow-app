import { Router } from "express";
import { getAllUsersController, getMe, login, logout, refresh, register, updateUserController } from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { loginSchema, registerSchema, updateUserSchema } from "../validators/auth.validator";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", authenticate, getMe);
router.get("/users", authenticate, getAllUsersController);
router.post("/update-user", validate(updateUserSchema), updateUserController);

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
