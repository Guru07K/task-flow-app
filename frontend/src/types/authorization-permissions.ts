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

export enum AuthorizedRoles {
  SuperAdmin = "SUPER_ADMIN",
  Admin = "ADMIN",
  Manager = "MANAGER",
  TL = "TL",
  Member = "MEMBER",
}
