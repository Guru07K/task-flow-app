import { useState } from "react";
import { Link } from "react-router-dom";
import { buttonVariants, Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConfigureAccessDialog from "@/components/rbac/ConfigureAccessDialog";
import { useAuthorization } from "@/hooks/useAuthorization";
import { useUsers } from "@/queries/auth.queries";
import type { User } from "@/services/auth.service";
import { AuthorizedRoles } from "@/types/authorization-permissions";

const Dashboard = () => {
  const { role } = useAuthorization();
  const isAdmin = role === AuthorizedRoles.SuperAdmin || role === AuthorizedRoles.Admin;

  const { data: users = [], isLoading, isError } = useUsers(isAdmin);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rbacDialogOpen, setRbacDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleConfigureAccess = (user: User) => {
    setFeedback(null);
    setSelectedUser(user);
    setRbacDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setRbacDialogOpen(open);

    if (!open) {
      setSelectedUser(null);
    }
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
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

      {isAdmin && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>User Access Management</CardTitle>
              <CardDescription>Manage roles, module access, and permissions for users.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {feedback && (
                <Alert>
                  <AlertDescription>{feedback}</AlertDescription>
                </Alert>
              )}

              {isLoading ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Loading users...</p>
              ) : isError ? (
                <p className="py-6 text-center text-sm text-destructive">Failed to load users. Please try again.</p>
              ) : users.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No users found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 text-right font-medium">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="border-b last:border-0">
                          <td className="px-4 py-3">{user.name}</td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3 text-right">
                            <Button size="sm" variant="outline" onClick={() => handleConfigureAccess(user)}>
                              Configure Access
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <ConfigureAccessDialog
            user={selectedUser}
            open={rbacDialogOpen}
            onOpenChange={handleDialogOpenChange}
            onSaved={setFeedback}
          />
        </>
      )}
    </main>
  );
};

export default Dashboard;
