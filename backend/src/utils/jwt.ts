// import jwt from "jsonwebtoken";
// import { AccessTokenPayload, RefreshTokenPayload } from "../types/auth.types";

// const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
// const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

// const ACCESS_TOKEN_EXPIRES_IN = "15m";
// const REFRESH_TOKEN_EXPIRES_IN = "7d";

// export const generateAccessToken = (payload: AccessTokenPayload) => {
//   return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
//     expiresIn: ACCESS_TOKEN_EXPIRES_IN,
//   });
// };

// export const generateRefreshToken = (payload: RefreshTokenPayload) => {
//   return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
//     expiresIn: REFRESH_TOKEN_EXPIRES_IN,
//   });
// };

// export const verifyAccessToken = (token: string): AccessTokenPayload => {
//   return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
// };

// export const verfiyRefreshToken = (token: string): RefreshTokenPayload => {
//   return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
// };

import jwt from "jsonwebtoken";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { AccessTokenPayload, RefreshTokenPayload } from "../types/auth.types.js";

const ACCESS_TOKEN_PRIVATE_KEY_PATH = process.env.ACCESS_TOKEN_PRIVATE_KEY_PATH;
const ACCESS_TOKEN_PUBLIC_KEY_PATH = process.env.ACCESS_TOKEN_PUBLIC_KEY_PATH;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_PRIVATE_KEY_PATH || !ACCESS_TOKEN_PUBLIC_KEY_PATH) {
  throw new Error("Access token RSA key paths are not configured");
}

if (!REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is not configured");
}

const ACCESS_TOKEN_PRIVATE_KEY = readFileSync(resolve(process.cwd(), ACCESS_TOKEN_PRIVATE_KEY_PATH), "utf8");
const ACCESS_TOKEN_PUBLIC_KEY = readFileSync(resolve(process.cwd(), ACCESS_TOKEN_PUBLIC_KEY_PATH), "utf8");

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

const ACCESS_TOKEN_ISSUER = "taskflow-api";
const ACCESS_TOKEN_AUDIENCE = "taskflow-services";

export const generateAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    issuer: ACCESS_TOKEN_ISSUER,
    audience: ACCESS_TOKEN_AUDIENCE,
    subject: payload.userId,
  });
};

export const generateRefreshToken = (payload: RefreshTokenPayload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, ACCESS_TOKEN_PUBLIC_KEY, {
    algorithms: ["RS256"],
    issuer: ACCESS_TOKEN_ISSUER,
    audience: ACCESS_TOKEN_AUDIENCE,
  }) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
};
