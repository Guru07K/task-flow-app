import { Request, Response } from "express";
import roleService from "../services/role.service";

export const getRoles = async (_req: Request, res: Response) => {
  const roles = await roleService.getRoles();
  res.status(200).json({
    data: roles,
  });
};
