import { Request, Response } from "express";
import { AssignModuleAccessDTO } from "../models/user-module-access.model";
import userModuleAccessService from "../services/user-module-access.service";

export const assignUserModuleAccess = async (req: Request, res: Response) => {
  const input = req.body as AssignModuleAccessDTO;
  const access = await userModuleAccessService.assignAccess(input);
  res.status(200).json({
    message: "User module access assigned successfully",
    data: access,
  });
};

export const getUserModuleAccess = async (req: Request, res: Response) => {
  const userAccess = await userModuleAccessService.getUserAuthorization(String(req.params.userId));
  res.status(200).json({
    data: userAccess,
  });
};
