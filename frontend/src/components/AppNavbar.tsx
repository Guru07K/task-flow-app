import { useDispatch } from "react-redux";
import { logoutUser } from "../services/auth.service";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAccessToken } from "../slices/auth.slice";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import NotificationBell from "./NotificationBell";

const AppNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      dispatch(clearAccessToken());
      navigate("/login", { replace: true });
    }
  };

  const isActive = (path: string) => (pathname === path || pathname.startsWith(`${path}/`) ? "secondary" : "ghost");

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              TF
            </span>
            <span className="hidden text-base font-semibold sm:inline">TaskFlow</span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link to="/dashboard" className={buttonVariants({ variant: isActive("/dashboard"), size: "sm" })}>
              Dashboard
            </Link>
            <Link to="/projects" className={buttonVariants({ variant: isActive("/projects"), size: "sm" })}>
              Projects
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
