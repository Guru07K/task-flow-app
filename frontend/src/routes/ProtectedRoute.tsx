import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { accessToken, isInitialized } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return <Navigate to={"/login"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
