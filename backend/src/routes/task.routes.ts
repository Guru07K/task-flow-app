import { Router } from "express";
import {
  createTaskController,
  deleteTaskController,
  getProjectTasksController,
  getTaskController,
  updateTaskController,
} from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";
import { createTaskSchema, updateTaskSchema } from "../validators/task.validator";
import { validate } from "../middleware/validation.middleware";

const router = Router();

router.use(authenticate);

router.post("/:projectId/tasks", validate(createTaskSchema), createTaskController);
router.get("/:projectId/tasks", getProjectTasksController);
router.get("/:projectId/tasks/:taskId", getTaskController);
router.patch("/:projectId/tasks/:taskId", validate(updateTaskSchema), updateTaskController);
router.delete("/:projectId/tasks/:taskId", deleteTaskController);

export default router;
