import Joi from "joi";
import { UserRole } from "../models/user.model";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).max(72).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),
  email: Joi.string().trim().lowercase().email().optional(),
  password: Joi.string().min(8).max(72).optional(),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .optional(),
});
