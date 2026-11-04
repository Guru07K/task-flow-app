export enum AuthorizedModules {
  TaskManagement = "task-management",
  ProjectManagement = "project-management",
  UserManagement = "user-management",
  ProjectMembers = "project-members",
}

export enum AuthorizedAccessPermissions {
  TaskView = "task:view",
  TaskCreate = "task:create",
  TaskEdit = "task:edit",
  TaskChangeStatus = "task:change-status",
  TaskDelete = "task:delete",
  ProjectView = "project:view",
  ProjectCreate = "project:create",
  ProjectEdit = "project:edit",
  ProjectDelete = "project:delete",
  UserView = "user:view",
  UserCreate = "user:create",
  UserEdit = "user:edit",
  UserDelete = "user:delete",
  ProjectMembersView = "project-members:view",
  ProjectMembersCreate = "project-members:create",
  ProjectMembersEdit = "project-members:edit",
  ProjectMembersDelete = "project-members:delete",
}

export const MODULE_PERMISSIONS: Record<AuthorizedModules, readonly AuthorizedAccessPermissions[]> = {
  [AuthorizedModules.TaskManagement]: [
    AuthorizedAccessPermissions.TaskView,
    AuthorizedAccessPermissions.TaskCreate,
    AuthorizedAccessPermissions.TaskEdit,
    AuthorizedAccessPermissions.TaskChangeStatus,
    AuthorizedAccessPermissions.TaskDelete,
  ],
  [AuthorizedModules.ProjectManagement]: [
    AuthorizedAccessPermissions.ProjectView,
    AuthorizedAccessPermissions.ProjectCreate,
    AuthorizedAccessPermissions.ProjectEdit,
    AuthorizedAccessPermissions.ProjectDelete,
  ],
  [AuthorizedModules.UserManagement]: [
    AuthorizedAccessPermissions.UserView,
    AuthorizedAccessPermissions.UserCreate,
    AuthorizedAccessPermissions.UserEdit,
    AuthorizedAccessPermissions.UserDelete,
  ],
  [AuthorizedModules.ProjectMembers]: [
    AuthorizedAccessPermissions.ProjectMembersView,
    AuthorizedAccessPermissions.ProjectMembersCreate,
    AuthorizedAccessPermissions.ProjectMembersEdit,
    AuthorizedAccessPermissions.ProjectMembersDelete,
  ],
};

export enum AuthorizedRoles {
  SuperAdmin = "SUPER_ADMIN",
  Admin = "ADMIN",
  Manager = "MANAGER",
  TL = "TL",
  Member = "MEMBER",
}
