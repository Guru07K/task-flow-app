import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import { clearAccessToken, setAccessToken } from "../slices/auth.slice";
import { verifyAccessToken, type AccessTokenVerification } from "../utils/jwt";
import type { RootState } from "@/store/store";

export type AuthorizationStatus = "unauthenticated" | "verifying" | "authorized";

export const useAuthorization = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Keep the token next to its result so a late verification can never apply to a newer token.
  const [verification, setVerification] = useState<{ token: string; result: AccessTokenVerification } | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    let active = true;

    verifyAccessToken(accessToken).then((result) => {
      if (!active) return;

      if (result.status === "expired") {
        api
          .post("/auth/refresh")
          .then((res) => dispatch(setAccessToken(res.data.data.accessToken)))
          .catch(() => dispatch(clearAccessToken()));
        return;
      }

      if (result.status === "invalid") {
        dispatch(clearAccessToken());
        return;
      }

      setVerification({ token: accessToken, result });
    });

    return () => {
      active = false;
    };
  }, [accessToken, dispatch]);

  const currentResult = accessToken && verification?.token === accessToken ? verification.result : null;
  const authorization = currentResult?.status === "valid" ? currentResult.payload : null;

  const status: AuthorizationStatus = !accessToken ? "unauthenticated" : authorization ? "authorized" : "verifying";

  const hasModuleAccess = (moduleName: string): boolean => {
    return authorization?.modules.some((module) => module.name === moduleName && module.access) ?? false;
  };

  const hasPermission = (moduleName: string, permission: string): boolean => {
    return (
      authorization?.modules.some(
        (module) => module.name === moduleName && module.access && module.permissions.includes(permission),
      ) ?? false
    );
  };

  return {
    status,
    role: authorization?.role ?? null,
    modules: authorization?.modules ?? [],
    hasModuleAccess,
    hasPermission,
    isAuthorizationLoading: status === "verifying",
  };
};
