import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/error-handler";

export const errorMiddleware = (
  err: ErrorHandler,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
};
