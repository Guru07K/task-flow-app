import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Card>
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Overview</p>
          <CardTitle className="mt-2 text-2xl sm:text-3xl">Dashboard</CardTitle>
          <CardDescription className="max-w-2xl text-base">
            Welcome back to TaskFlow. Manage your projects, tasks, and team from one place.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Link to="/projects" className={buttonVariants()}>
            Go to Projects
          </Link>
        </CardContent>
      </Card>
    </main>
  );
};

export default Dashboard;
