import { Request, Response } from "express";
import { getAllUsers, getCurrentUser, loginUser, refreshAccessToken, registerUser, updateUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
};

export const login = async (req: Request, res: Response) => {
  const { accessToken, refreshToken, user } = await loginUser(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 100,
  });

  res.status(200).json({
    message: "Login successful",
    data: {
      accessToken,
      user,
    },
  });
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const accessToken = await refreshAccessToken(req.cookies.refreshToken);

  res.status(200).json({
    data: {
      accessToken,
    },
  });
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    message: "Logout successfuly",
  });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = await getCurrentUser(req.user!.userId);

  res.status(200).json({
    data: user,
  });
};

export const updateUserController = async (req: Request, res: Response) => {
  const user = await updateUser(String(req.params.id), req.body);

  res.status(201).json({
    message: "User updated successfully",
    data: user,
  });
};

export const getAllUsersController = async (_req: Request, res: Response) => {
  const users = await getAllUsers();
  res.status(200).json({
    data: users,
  });
};
