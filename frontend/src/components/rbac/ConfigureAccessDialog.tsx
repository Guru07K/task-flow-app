import { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PermissionSelector from "./PermissionSelector";
import { MODULE_PERMISSIONS } from "@/utils/rbac-permissions";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface ModuleAccess {
  name: string;
  access: boolean;
  permissions: string[];
}

interface UserAccess {
  roleId: string;
  role: string;
  modules: ModuleAccess[];
}

interface ConfigureAccessDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { userId: string; roleId: string; modules: ModuleAccess[] }) => void;
  loading: boolean;
}

const ConfigureAccessDialog = ({ user, open, onOpenChange, onSave, loading }: ConfigureAccessDialogProps) => {
  const [userAccess, setUserAccess] = useState<UserAccess | null>(null);
  const [modules, setModules] = useState<ModuleAccess[]>([]);

  useEffect(() => {
    if (!open || !user) return;

    setUserAccess(null);
    setModules([]);

    fetchAccess(user._id);
  }, [open, user]);

  const fetchAccess = async (userId: string) => {
    try {
      // Replace this URL with your existing API service if needed.
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user-module-access/${userId}`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch access");

      const result = await response.json();
      const access: UserAccess = result.data;

      setUserAccess(access);
      setModules(access.modules);
    } catch (error) {
      console.error("Failed to load user access:", error);
    }
  };

  const updateModule = (moduleName: string, access: boolean) => {
    setModules((previous) => {
      const existing = previous.find((module) => module.name === moduleName);

      if (existing) {
        return previous.map((module) =>
          module.name === moduleName
            ? {
                ...module,
                access,
                permissions: access ? module.permissions : [],
              }
            : module,
        );
      }

      return [
        ...previous,
        {
          name: moduleName,
          access,
          permissions: [],
        },
      ];
    });
  };

  const updatePermissions = (moduleName: string, permissions: string[]) => {
    setModules((previous) => previous.map((module) => (module.name === moduleName ? { ...module, permissions } : module)));
  };

  const handleSave = () => {
    if (!user || !userAccess) return;

    onSave({
      userId: user._id,
      roleId: userAccess.roleId,
      modules,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure User Access</DialogTitle>
          <DialogDescription>Manage module access and permissions.</DialogDescription>
        </DialogHeader>

        {user && (
          <div className="rounded-lg border p-3">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {userAccess && (
              <p className="mt-2 text-sm">
                Role: <span className="font-medium">{userAccess.role}</span>
              </p>
            )}
          </div>
        )}

        {!userAccess ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading access configuration...</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(MODULE_PERMISSIONS).map(([moduleName, permissions]) => {
              const currentModule = modules.find((module) => module.name === moduleName);

              const enabled = currentModule?.access ?? false;

              return (
                <div key={moduleName} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{moduleName.replaceAll("-", " ")}</p>
                      <p className="text-xs text-muted-foreground">{enabled ? "Module enabled" : "Module disabled"}</p>
                    </div>

                    <Switch checked={enabled} onCheckedChange={(checked) => updateModule(moduleName, checked)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Permissions</Label>

                    <PermissionSelector
                      options={permissions}
                      value={currentModule?.permissions ?? []}
                      onChange={(selected) => updatePermissions(moduleName, selected)}
                      disabled={!enabled}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={!userAccess || loading}>
            {loading ? "Saving..." : "Save Access"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigureAccessDialog;
