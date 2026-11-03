export const MODULE_PERMISSIONS = {
  "user-management": [
    { label: "View Users", value: "user:view" },
    { label: "Create User", value: "user:create" },
    { label: "Edit User", value: "user:edit" },
    { label: "Delete User", value: "user:delete" },
  ],

  "task-management": [
    { label: "View Tasks", value: "task:view" },
    { label: "Create Task", value: "task:create" },
    { label: "Edit Task", value: "task:edit" },
    { label: "Change Task Status", value: "task:change-status" },
    { label: "Delete Task", value: "task:delete" },
  ],

  "project-management": [
    { label: "View Projects", value: "project:view" },
    { label: "Create Project", value: "project:create" },
    { label: "Update Project", value: "project:update" },
    { label: "Edit Project", value: "project:edit" },
    { label: "Delete Project", value: "project:delete" },
  ],

  "project-members": [
    { label: "View Project Members", value: "project-members:view" },
    { label: "Create Project Member", value: "project-members:create" },
    { label: "Edit Project Member", value: "project-members:edit" },
    { label: "Delete Project Member", value: "project-members:delete" },
  ],
} as const;
