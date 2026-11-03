import { Router } from "express";
import { getRoles } from "../controllers/role.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/authorization.middleware";
import { AuthorizedRoles } from "../types/authorization_permissions.types";

const router = Router();

router.use(authenticate);

router.get("/", authorizeRole(AuthorizedRoles.SuperAdmin, AuthorizedRoles.Admin), getRoles);

export default router;
