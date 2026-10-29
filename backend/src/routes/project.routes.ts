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

const router = Router();

router.use(authenticate);

router.post("/", validate(createProjectSchema), createProjectController);
router.get("/", getMyProjectsController);
router.get("/:id", getProjectController);
router.patch("/:id", validate(updateProjectSchema), updateProjectController);
router.delete("/:id", deleteProjectController);

router.post("/:id/members", validate(addProjectMemeberSchema), addProjectMemberController);
router.get("/:id/members", getProjectMembersController);
router.patch("/:id/members/:userId", validate(updateProjectMemberSchema), updateProjectMemberRoleController);
router.delete("/:id/members/:userId", removeProjectMemberController);

export default router;
