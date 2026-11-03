import Joi from "joi";
import { AuthorizedAccessPermissions, AuthorizedModules } from "../types/authorization_permissions.types";

const moduleAccessSchema = Joi.object({
  name: Joi.string()
    .trim()
    .lowercase()
    .valid(...Object.values(AuthorizedModules))
    .required(),
  access: Joi.boolean().required(),
  permissions: Joi.array().items(Joi.string().valid(...Object.values(AuthorizedAccessPermissions))).unique().default([]),
});

export const assignUserModuleAccessSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  roleId: Joi.string().hex().length(24).required(),
  modules: Joi.array().items(moduleAccessSchema).unique("name").required(),
});
