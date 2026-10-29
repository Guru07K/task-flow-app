import { useState } from "react";
import { useAddProjectMember } from "../../queries/project.queries";
import type { ProjectMemberRole } from "../../services/project.service";

interface AddMemberFormProps {
  projectId: string;
}

const AddMemberForm = ({ projectId }: AddMemberFormProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<ProjectMemberRole>("member");

  const addMember = useAddProjectMember();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    addMember.mutate(
      { projectId, input: { email: email.trim(), role } },
      {
        onSuccess: () => {
          setEmail("");
          setRole("member");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border p-4">
      <h3 className="font-semibold">Add Project Member</h3>

      <div>
        <label htmlFor="member-email" className="mb-1 block text-sm">
          Email
        </label>

        <input
          id="member-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter registered user's email"
          required
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="member-role" className="mb-1 block text-sm">
          Role
        </label>

        <select
          id="member-role"
          value={role}
          onChange={(e) => setRole(e.target.value as ProjectMemberRole)}
          className="w-full rounded border px-3 py-2"
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="tl">TL</option>
          <option value="member">Member</option>
        </select>
      </div>

      {addMember.isError && <p className="text-sm text-red-600">{addMember.error.message || "Failed to add member."}</p>}
      {addMember.isSuccess && <p className="text-sm text-green-600">Member added successfully.</p>}

      <button type="submit" disabled={addMember.isPending} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
        {addMember.isPending ? "Adding..." : "Add Member"}
      </button>
    </form>
  );
};

export default AddMemberForm;
