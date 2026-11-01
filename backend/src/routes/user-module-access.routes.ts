import { NextFunction, Request, Response, Router } from "express";
import { assignUserModuleAccess, getUserModuleAccess } from "../controllers/user-module-access.controller";
import { authenticate } from "../middleware/auth.middleware";
import { ErrorHandler } from "../utils/error-handler";
import { assignUserModuleAccessSchema } from "../validators/user-module-access.validator";
import { validate } from "../middleware/validation.middleware";

const router = Router();

router.use(authenticate);

// Only Super Admin can assign user module access.
router.post(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== "ADMIN") {
      return next(new ErrorHandler(403, "Access denied"));
    }

    next();
  },
  validate(assignUserModuleAccessSchema),
  assignUserModuleAccess,
);

router.get("/:userId", getUserModuleAccess);

export default router;
