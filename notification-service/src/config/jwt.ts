import jwt from "jsonwebtoken";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const publicKeyPath = process.env.ACCESS_TOKEN_PUBLIC_KEY_PATH;
const issuer = process.env.ACCESS_TOKEN_ISSUER;
const audience = process.env.ACCESS_TOKEN_AUDIENCE;

if (!publicKeyPath || !issuer || !audience) {
  throw new Error("JWT verification configuration is incomplete");
}

const publicKey = readFileSync(resolve(process.cwd(), publicKeyPath), "utf8");

export interface AuthenticatedUser {
  userId: string;
  role: string;
}

export const verifyAccessToken = (token: string): AuthenticatedUser => {
  const payload = jwt.verify(token, publicKey, {
    algorithms: ["RS256"],
    issuer,
    audience,
  });

  if (
    typeof payload === "string" ||
    typeof payload.userId !== "string" ||
    typeof payload.role !== "string" ||
    typeof payload.sub !== "string" ||
    payload.sub !== payload.userId
  ) {
    throw new Error("Invalid access token payload");
  }

  return {
    userId: payload.userId,
    role: payload.role,
  };
};
