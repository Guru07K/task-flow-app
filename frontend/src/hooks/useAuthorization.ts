import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { verifyAccessToken } from "../utils/jwt";
import type { RootState } from "@/store/store";
import type { IAccessTokenPayload } from "@/types/authorization.types";

export const useAuthorization = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [authorization, setAuthorization] = useState<IAccessTokenPayload | null>(null);

  useEffect(() => {
    let active = true;

    setAuthorization(null);

    if (!accessToken) return;

    verifyAccessToken(accessToken).then((payload) => {
      if (active) {
        setAuthorization(payload);
      }
    });

    return () => {
      active = false;
    };
  }, [accessToken]);

  const hasModuleAccess = (moduleName: string): boolean => {
    return authorization?.modules.some((module) => module.name === moduleName && module.access) ?? false;
  };

  const hasPermission = (permission: string): boolean => {
    return authorization?.modules.some((module) => module.access && module.permissions.includes(permission)) ?? false;
  };

  return {
    role: authorization?.role ?? null,
    modules: authorization?.modules ?? [],
    hasModuleAccess,
    hasPermission,
    isAuthorizationLoading: Boolean(accessToken) && !authorization,
  };
};
