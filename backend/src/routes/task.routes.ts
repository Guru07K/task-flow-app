import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";
import { createTaskSchema, updateTaskSchema } from "../validators/task.validator";
import { validate } from "../middleware/validation.middleware";
import { authorizeModule, authorizePermission } from "../middleware/authorization.middleware";
import { AuthorizedAccessPermissions, AuthorizedModules } from "../types/authorization_permissions.types";

const router = Router();
const taskController = new TaskController();

router.use(authenticate);
router.use(authorizeModule(AuthorizedModules.TaskManagement));

router.post(
  "/:projectId/tasks",
  validate(createTaskSchema),
  authorizePermission(AuthorizedAccessPermissions.TaskCreate),
  taskController.createTask,
);

router.get("/:projectId/tasks", authorizePermission(AuthorizedAccessPermissions.TaskView), taskController.getProjectTasks);
router.get("/:projectId/tasks/:taskId", authorizePermission(AuthorizedAccessPermissions.TaskView), taskController.getTask);

router.patch(
  "/:projectId/tasks/:taskId",
  validate(updateTaskSchema),
  authorizePermission(AuthorizedAccessPermissions.TaskEdit),
  taskController.updateTask,
);
router.delete("/:projectId/tasks/:taskId", authorizePermission(AuthorizedAccessPermissions.TaskDelete), taskController.deleteTask);

export default router;
