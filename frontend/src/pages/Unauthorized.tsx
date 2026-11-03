import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted/40 px-4 text-center">
      <h1 className="text-2xl font-semibold">Access denied</h1>
      <p className="text-sm text-muted-foreground">You do not have permission to view this page.</p>
      <Link to="/dashboard" className="text-sm font-medium underline-offset-4 hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
