import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useRoles } from "@/queries/role.queries";
import { useAssignUserModuleAccess, useUserModuleAccess } from "@/queries/user-module-access.queries";
import type { User } from "@/services/auth.service";
import { getApiErrorMessage, type ModuleAccess, type UserModuleAccess } from "@/services/user-module-access.service";
import { MODULE_PERMISSIONS } from "@/utils/rbac-permissions";
import PermissionSelector from "./PermissionSelector";

type ModuleName = keyof typeof MODULE_PERMISSIONS;

const MODULE_NAMES = Object.keys(MODULE_PERMISSIONS) as ModuleName[];

const buildModuleState = (savedModules: ModuleAccess[] = []): ModuleAccess[] =>
  MODULE_NAMES.map((name) => {
    const savedModule = savedModules.find((module) => module.name === name);
    const permissionValues = MODULE_PERMISSIONS[name].map((option) => option.value);

    return {
      name,
      access: savedModule?.access ?? false,
      permissions: (savedModule?.permissions ?? []).filter((permission) => permissionValues.some((value) => value === permission)),
    };
  });

interface AccessFormProps {
  user: User;
  initialAccess: UserModuleAccess | null;
  roles: { _id: string; name: string }[];
  onSaved: (message: string) => void;
  onOpenChange: (open: boolean) => void;
}

const AccessForm = ({ user, initialAccess, roles, onSaved, onOpenChange }: AccessFormProps) => {
  const [roleId, setRoleId] = useState(initialAccess?.roleId ?? "");
  const [modules, setModules] = useState<ModuleAccess[]>(() => buildModuleState(initialAccess?.modules));

  const assignAccess = useAssignUserModuleAccess();

  const roleItems = roles.map((role) => ({ value: role._id, label: role.name }));

  const updateModuleAccess = (moduleName: string, access: boolean) => {
    setModules((previous) =>
      previous.map((module) =>
        module.name === moduleName
          ? {
              ...module,
              access,
              permissions: access ? module.permissions : [],
            }
          : module,
      ),
    );
  };

  const updateModulePermissions = (moduleName: string, permissions: string[]) => {
    setModules((previous) => previous.map((module) => (module.name === moduleName ? { ...module, permissions } : module)));
  };

  const handleSave = () => {
    if (!roleId || assignAccess.isPending) return;

    assignAccess.mutate(
      { userId: user._id, roleId, modules },
      {
        onSuccess: () => {
          onSaved(`Access updated for ${user.name}.`);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="access-role">Role</Label>

        <Select
          items={roleItems}
          value={roleId}
          onValueChange={(value) => value && setRoleId(value)}
          disabled={assignAccess.isPending}
        >
          <SelectTrigger id="access-role" className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>

          <SelectContent>
            {roleItems.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {MODULE_NAMES.map((moduleName) => {
          const currentModule = modules.find((module) => module.name === moduleName);
          const enabled = currentModule?.access ?? false;

          return (
            <div key={moduleName} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium capitalize">{moduleName.replaceAll("-", " ")}</p>
                  <p className="text-xs text-muted-foreground">{enabled ? "Module enabled" : "Module disabled"}</p>
                </div>

                <Switch
                  aria-label={`${moduleName.replaceAll("-", " ")} access`}
                  checked={enabled}
                  disabled={assignAccess.isPending}
                  onCheckedChange={(checked) => updateModuleAccess(moduleName, checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Permissions</Label>

                <PermissionSelector
                  options={MODULE_PERMISSIONS[moduleName]}
                  value={currentModule?.permissions ?? []}
                  onChange={(selected) => updateModulePermissions(moduleName, selected)}
                  disabled={!enabled || assignAccess.isPending}
                />
              </div>
            </div>
          );
        })}
      </div>

      {assignAccess.isError && (
        <Alert variant="destructive">
          <AlertDescription>{getApiErrorMessage(assignAccess.error, "Failed to save access configuration.")}</AlertDescription>
        </Alert>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={assignAccess.isPending}>
          Cancel
        </Button>

        <Button onClick={handleSave} disabled={!roleId || assignAccess.isPending}>
          {assignAccess.isPending ? "Saving..." : "Save Access"}
        </Button>
      </DialogFooter>
    </>
  );
};

interface ConfigureAccessDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (message: string) => void;
}

const ConfigureAccessDialog = ({ user, open, onOpenChange, onSaved }: ConfigureAccessDialogProps) => {
  const accessQuery = useUserModuleAccess(open && user ? user._id : "");
  const rolesQuery = useRoles();

  const renderBody = () => {
    if (!user) return null;

    if (accessQuery.isPending || rolesQuery.isPending) {
      return <p className="py-8 text-center text-sm text-muted-foreground">Loading access configuration...</p>;
    }

    if (accessQuery.isError || rolesQuery.isError) {
      const error = accessQuery.error ?? rolesQuery.error;

      return (
        <Alert variant="destructive">
          <AlertDescription>{getApiErrorMessage(error, "Failed to load access configuration.")}</AlertDescription>
        </Alert>
      );
    }

    return (
      <AccessForm
        key={user._id}
        user={user}
        initialAccess={accessQuery.data ?? null}
        roles={rolesQuery.data ?? []}
        onSaved={onSaved}
        onOpenChange={onOpenChange}
      />
    );
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
            <p className="mt-2 text-sm">
              Current role:{" "}
              <span className="font-medium">{accessQuery.data?.role ?? (accessQuery.isSuccess ? "Not assigned" : "...")}</span>
            </p>
          </div>
        )}

        {renderBody()}
      </DialogContent>
    </Dialog>
  );
};

export default ConfigureAccessDialog;
