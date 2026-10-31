import { Outlet } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-muted/40">
      <AppNavbar />

      <Outlet />
    </div>
  );
};

export default AppLayout;
