import { useRemoveProjectMember, useUpdateProjectMemberRole } from "../../queries/project.queries";
import type { ProjectMemberRole } from "../../services/project.service";

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
    return <p className="text-gray-500">No project members found.</p>;
  }

  return (
    <div className="space-y-3">
      {members.map((member) => {
        const isOwner = member.user._id === ownerId;

        return (
          <div key={member.user._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
            <div>
              <p className="font-medium">
                {member.user.name}
                {isOwner && <span className="ml-2 text-xs text-gray-500">Project Owner</span>}
              </p>

              <p className="text-sm text-gray-500">{member.user.email}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={member.role}
                disabled={isOwner || updateRole.isPending}
                onChange={(e) => handleRoleChange(member.user._id, e.target.value as ProjectMemberRole)}
                className="rounded border px-3 py-2 disabled:opacity-50"
                aria-label={`Role for ${member.user.name}`}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="tl">TL</option>
                <option value="member">Member</option>
              </select>

              {!isOwner && (
                <button
                  type="button"
                  disabled={removeMember.isPending}
                  onClick={() => handleRemove(member.user._id, member.user.name)}
                  className="rounded border px-3 py-2 text-red-600 disabled:opacity-50"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        );
      })}

      {(updateRole.isError || removeMember.isError) && (
        <p className="text-sm text-red-600">{updateRole.isError ? updateRole.error.message : removeMember.error?.message}</p>
      )}
    </div>
  );
};

export default MemberList;
