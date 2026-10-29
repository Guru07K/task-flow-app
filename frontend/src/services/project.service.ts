import api from "../api/axios";

export interface CreateProjectInput {
  name: string;
  description: string;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {}

export type ProjectMemberRole = "admin" | "manager" | "tl" | "member";

export interface AddProjectMemberInput {
  email: string;
  role: ProjectMemberRole;
}

export interface UpdateProjectMemberRoleInput extends Pick<AddProjectMemberInput, "role"> {}

export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data.data;
};

export const getProject = async (projectId: string) => {
  const res = await api.get(`/projects/${projectId}`);
  return res.data.data;
};

export const createProject = async (input: CreateProjectInput) => {
  const res = await api.post("/projects", input);
  return res.data.data;
};

export const updateProject = async (projectId: string, input: UpdateProjectInput) => {
  const res = await api.patch(`/projects/${projectId}`, input);
  return res.data.data;
};

export const deleteProject = async (projectId: string) => {
  await api.delete(`/projects/${projectId}`);
};

export const getProjectMembers = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}/members`);
  return response.data.data;
};

export const addProjectMember = async (projectId: string, input: AddProjectMemberInput) => {
  const response = await api.post(`/projects/${projectId}/members`, input);
  return response.data.data;
};

export const updateProjectMemberRole = async (projectId: string, userId: string, input: UpdateProjectMemberRoleInput) => {
  const response = await api.patch(`/projects/${projectId}/members/${userId}`, input);
  return response.data.data;
};

export const removeProjectMember = async (projectId: string, userId: string) => {
  const response = await api.delete(`/projects/${projectId}/members/${userId}`);
  return response.data;
};
