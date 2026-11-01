import type { ReactNode } from "react";
import { useAuthorization } from "../hooks/useAuthorization";

interface CanProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

const HasPermission = ({ permission, children, fallback = null }: CanProps) => {
  const { hasPermission } = useAuthorization();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default HasPermission;
