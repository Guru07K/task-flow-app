import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthorization } from "@/hooks/useAuthorization";

interface ProtectedRouteProps {
  moduleName?: string;
  permission?: string;
}

const ProtectedRoute = ({ moduleName, permission }: ProtectedRouteProps) => {
  const { accessToken, isInitialized } = useSelector((state: RootState) => state.auth);

  const { hasModuleAccess, hasPermission } = useAuthorization();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return <Navigate to={"/login"} replace />;
  }

  if (moduleName && !hasModuleAccess(moduleName)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
