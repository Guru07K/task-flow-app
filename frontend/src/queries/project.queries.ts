import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addProjectMember,
  createProject,
  deleteProject,
  getProject,
  getProjectMembers,
  getProjects,
  removeProjectMember,
  updateProject,
  updateProjectMemberRole,
  type AddProjectMemberInput,
  type UpdateProjectInput,
  type UpdateProjectMemberRoleInput,
} from "../services/project.service";

export const useGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
};

export const useGetProject = (id: string) => {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProject(id),
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

interface updateType {
  id: string;
  input: UpdateProjectInput;
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: updateType) => updateProject(data.id, data.input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
    },
  });
};

export const useGetProjectMembers = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId, "members"],
    queryFn: () => getProjectMembers(projectId),
    enabled: Boolean(projectId),
  });
};

interface AddMemberVariables {
  projectId: string;
  input: AddProjectMemberInput;
}

export const useAddProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddMemberVariables) => addProjectMember(data.projectId, data.input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "members"],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId],
      });
    },
  });
};

interface UpdateMemberRoleVariables {
  projectId: string;
  userId: string;
  input: UpdateProjectMemberRoleInput;
}

export const useUpdateProjectMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMemberRoleVariables) => updateProjectMemberRole(data.projectId, data.userId, data.input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "members"],
      });
    },
  });
};

interface RemoveMemberVariables {
  projectId: string;
  userId: string;
}

export const useRemoveProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, userId }: RemoveMemberVariables) => removeProjectMember(projectId, userId),

    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "members"],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", projectId],
      });
    },
  });
};
