import Joi from "joi";
import { TaskStatus, TaskPriority } from "../models/task.model";

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(2).max(150).required(),
  description: Joi.string().trim().max(1000).optional(),
  assignedTo: Joi.string().hex().length(24).optional(),

  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .default(TaskStatus.TODO),

  priority: Joi.string()
    .valid(...Object.values(TaskPriority))
    .default(TaskPriority.MEDIUM),

  dueDate: Joi.date().iso().optional(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(2).max(150).optional(),
  description: Joi.string().trim().max(1000).optional(),
  assignedTo: Joi.string().hex().length(24).optional(),

  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .optional(),

  priority: Joi.string()
    .valid(...Object.values(TaskPriority))
    .optional(),

  dueDate: Joi.date().iso().optional(),
}).min(1);
