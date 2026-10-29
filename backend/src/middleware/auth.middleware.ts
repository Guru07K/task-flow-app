import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { ErrorHandler } from "../utils/error-handler";
import { getCurrentUser } from "../services/auth.service";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ErrorHandler(401, "Access token is required"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);

    if (payload) {
      const user = await getCurrentUser(payload.userId);
      req.user = user;
      next();
    }
  } catch (error) {
    next(new ErrorHandler(401, "Invalid or expired access token"));
  }
};
