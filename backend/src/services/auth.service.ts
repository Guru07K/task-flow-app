import bcrypt from "bcrypt";
import { LoginInput, RegisterInput, UserRole } from "../models/user.model";
import { User } from "../schema/user.schema";
import { ErrorHandler } from "../utils/error-handler";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";

const SALT_ROUNDS = 12;

export const registerUser = async (input: RegisterInput) => {
  const { email, name, password } = input;

  let user = await User.findOne({ email });

  if (user) {
    throw new ErrorHandler(409, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const { password: _password, ...rest } = user.toObject();

  return rest;
};

export const loginUser = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email }).select("+password");

  if (!user) {
    throw new ErrorHandler(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw new ErrorHandler(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
  });

  const { password: password, ...rest } = user.toObject();

  return {
    accessToken,
    refreshToken,
    user: rest,
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new ErrorHandler(401, "Refresh token is required");
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    const user = await User.findById(payload.userId);

    if (!user) {
      throw new ErrorHandler(401, "User no longer exists");
    }

    return generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });
  } catch (error) {
    throw new ErrorHandler(401, "Invalid or expired refresh token");
  }
};

export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ErrorHandler(404, "User not found");
  }

  return user;
};
