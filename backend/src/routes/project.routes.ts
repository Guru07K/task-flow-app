import { Router } from "express";
import {
  addProjectMemberController,
  createProjectController,
  deleteProjectController,
  getMyProjectsController,
  getProjectController,
  getProjectMembersController,
  removeProjectMemberController,
  updateProjectController,
  updateProjectMemberRoleController,
} from "../controllers/project.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  addProjectMemeberSchema,
  createProjectSchema,
  updateProjectMemberSchema,
  updateProjectSchema,
} from "../validators/project.validator";
import { authorizeModule, authorizePermission } from "../middleware/authorization.middleware";
import { AuthorizedAccessPermissions, AuthorizedModules } from "../types/authorization_permissions.types";

const router = Router();

router.use(authenticate);
router.use(authorizeModule(AuthorizedModules.ProjectManagement));

router.post(
  "/",
  validate(createProjectSchema),
  authorizePermission(AuthorizedAccessPermissions.ProjectCreate),
  createProjectController,
);

router.get("/", authorizePermission(AuthorizedAccessPermissions.ProjectView), getMyProjectsController);
router.get("/:id", authorizePermission(AuthorizedAccessPermissions.ProjectView), getProjectController);

router.patch(
  "/:id",
  validate(updateProjectSchema),
  authorizePermission(AuthorizedAccessPermissions.ProjectUpdate),
  updateProjectController,
);
router.delete("/:id", authorizePermission(AuthorizedAccessPermissions.ProjectDelete), deleteProjectController);

router.post("/:id/members", validate(addProjectMemeberSchema), addProjectMemberController);
router.get("/:id/members", getProjectMembersController);
router.patch("/:id/members/:userId", validate(updateProjectMemberSchema), updateProjectMemberRoleController);
router.delete("/:id/members/:userId", removeProjectMemberController);

export default router;
