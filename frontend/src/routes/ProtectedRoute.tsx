import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthorization } from "@/hooks/useAuthorization";

interface ProtectedRouteProps {
  moduleName?: string;
  permission?: string;
}

const ProtectedRoute = ({ moduleName, permission }: ProtectedRouteProps) => {
  const isInitialized = useSelector((state: RootState) => state.auth.isInitialized);

  const { status, hasModuleAccess, hasPermission } = useAuthorization();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <Navigate to={"/login"} replace />;
  }

  if (status === "verifying") {
    return <div>Loading...</div>;
  }

  if (moduleName && !hasModuleAccess(moduleName)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (moduleName && permission && !hasPermission(moduleName, permission)) {
    return <Navigate to="/unauthorized" replace />;
  }


  return <Outlet />;
};

export default ProtectedRoute;
