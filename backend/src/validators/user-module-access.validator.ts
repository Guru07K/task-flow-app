import Joi from "joi";

const moduleAccessSchema = Joi.object({
  name: Joi.string().trim().lowercase().required(),
  access: Joi.boolean().required(),
  permissions: Joi.array(),
});

export const assignUserModuleAccessSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  roleId: Joi.string().hex().length(24).required(),
  modules: Joi.array().items(moduleAccessSchema).unique("name").required(),
});
