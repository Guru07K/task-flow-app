import Joi from "joi";
import { ProjectMemberRole } from "../models/project.model";

export const createProjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().max(500).allow("").optional(),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  description: Joi.string().trim().max(500).allow("").optional(),
});

export const addProjectMemeberSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  role: Joi.string()
    .valid(...Object.values(ProjectMemberRole))
    .required(),
});

export const updateProjectMemberSchema = Joi.object({
  role: Joi.string()
    .valid(...Object.values(ProjectMemberRole))
    .required(),
});
