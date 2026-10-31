import type { ProjectMemberRole } from "../../services/project.service";

export const memberRoleOptions: { value: ProjectMemberRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "tl", label: "TL" },
  { value: "member", label: "Member" },
];
