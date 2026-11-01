import { NextFunction, Request, RequestHandler, Response } from "express";
import { ErrorHandler } from "../utils/error-handler";

export const authorizedUser = (...userRole: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authorization = req.authorization;

    const isAuthorizedRole = userRole.includes(authorization.role);

    if (!isAuthorizedRole) {
      return next(new ErrorHandler(401, "You are not authorized to access this resource"));
    }

    next();
  };
};

export const authorizeModule = (moduleName: string): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authorization = req.authorization;
    if (!authorization) {
      return next(new ErrorHandler(401, "Authorization required"));
    }

    const module = authorization.modules.find((module) => module.name === moduleName);
    if (!module || !module.access) {
      return next(new ErrorHandler(403, "You don't have access to this module"));
    }

    next();
  };
};

export const authorizePermission = (permission: string): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authorization = req.authorization;
    if (!authorization) {
      return next(new ErrorHandler(401, "Authorization required"));
    }

    const hasPermission = authorization.modules.some((module) => module.access && module.permissions.includes(permission));
    if (!hasPermission) {
      return next(new ErrorHandler(403, "You don't have permission to perform this action"));
    }

    next();
  };
};
