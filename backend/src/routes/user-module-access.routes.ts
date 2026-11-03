import { Router } from "express";
import { assignUserModuleAccess, getUserModuleAccess } from "../controllers/user-module-access.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/authorization.middleware";
import { validate } from "../middleware/validation.middleware";
import { AuthorizedRoles } from "../types/authorization_permissions.types";
import { assignUserModuleAccessSchema } from "../validators/user-module-access.validator";

const router = Router();

router.use(authenticate);

// Only RBAC admins can read or assign user module access.
router.get("/:userId", authorizeRole(AuthorizedRoles.SuperAdmin, AuthorizedRoles.Admin), getUserModuleAccess);

router.post(
  "/",
  authorizeRole(AuthorizedRoles.SuperAdmin, AuthorizedRoles.Admin),
  validate(assignUserModuleAccessSchema),
  assignUserModuleAccess,
);

export default router;
