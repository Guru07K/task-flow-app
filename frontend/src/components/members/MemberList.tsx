import { EllipsisVertical, Trash2 } from "lucide-react";
import { useRemoveProjectMember, useUpdateProjectMemberRole } from "../../queries/project.queries";
import type { ProjectMemberRole } from "../../services/project.service";
import { memberRoleOptions } from "./member-roles";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProjectMember {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  role: ProjectMemberRole;
}

interface MemberListProps {
  projectId: string;
  members: ProjectMember[];
  ownerId: string;
}

const MemberList = ({ projectId, members, ownerId }: MemberListProps) => {
  const updateRole = useUpdateProjectMemberRole();
  const removeMember = useRemoveProjectMember();

  const handleRoleChange = (userId: string, role: ProjectMemberRole) => {
    updateRole.mutate({
      projectId,
      userId,
      input: { role },
    });
  };

  const handleRemove = (userId: string, name: string) => {
    if (!window.confirm(`Remove ${name} from this project?`)) {
      return;
    }
    removeMember.mutate({ projectId, userId });
  };

  if (!members.length) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No project members found.</div>
    );
  }

  return (
    <div className="space-y-2">
      {members.map((member) => {
        const isOwner = member.user._id === ownerId;

        return (
          <div
            key={member.user._id}
            className="flex flex-col gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar>
                <AvatarFallback className="uppercase">{member.user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{member.user.name}</p>
                  {isOwner && <Badge variant="secondary">Project Owner</Badge>}
                </div>

                <p className="truncate text-sm text-muted-foreground">{member.user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:shrink-0">
              <Select
                items={memberRoleOptions}
                value={member.role}
                disabled={isOwner || updateRole.isPending}
                onValueChange={(value) => value && handleRoleChange(member.user._id, value as ProjectMemberRole)}
              >
                <SelectTrigger size="sm" aria-label={`Role for ${member.user.name}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {memberRoleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {!isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${member.user.name}`} />}>
                    <EllipsisVertical />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      variant="destructive"
                      disabled={removeMember.isPending}
                      onClick={() => handleRemove(member.user._id, member.user.name)}
                    >
                      <Trash2 />
                      Remove from project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        );
      })}

      {(updateRole.isError || removeMember.isError) && (
        <Alert variant="destructive">
          <AlertDescription>{updateRole.isError ? updateRole.error.message : removeMember.error?.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MemberList;
