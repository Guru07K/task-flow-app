import type { IAccessTokenPayload } from "@/types/authorization.types";
import { importSPKI, jwtVerify } from "jose";

const PUBLIC_KEY = import.meta.env.VITE_ACCESS_TOKEN_PUBLIC_KEY?.replace(/\\n/g, "\n");

let publicKeyPromise: ReturnType<typeof importSPKI> | null = null;

const getPublicKey = () => {
  if (!PUBLIC_KEY) {
    throw new Error("Access token public key is not configured");
  }

  if (!publicKeyPromise) {
    publicKeyPromise = importSPKI(PUBLIC_KEY, "RS256");
  }

  return publicKeyPromise;
};

export const verifyAccessToken = async (token: string): Promise<IAccessTokenPayload | null> => {
  try {
    const publicKey = await getPublicKey();

    const { payload } = await jwtVerify(token, publicKey, {
      algorithms: ["RS256"],
      issuer: "taskflow-api",
      audience: "taskflow-services",
    });

    if (typeof payload.userId !== "string" || typeof payload.role !== "string" || !Array.isArray(payload.modules)) {
      return null;
    }

    return payload as unknown as IAccessTokenPayload;
  } catch {
    return null;
  }
};
