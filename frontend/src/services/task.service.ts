import api from "../api/axios";

export interface CreateTaskInput {
  title: string;
  description?: string;
  assignedTo?: string | null;
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {}

export const getProjectTasks = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}/tasks`);
  return response.data.data;
};

export const getTask = async (projectId: string, taskId: string) => {
  const response = await api.get(`/projects/R${projectId}/tasks/${taskId}`);
  return response.data.data;
};

export const createTask = async (projectId: string, input: CreateTaskInput) => {
  const response = await api.post(`/projects/${projectId}/tasks`, input);
  return response.data.data;
};

export const updateTask = async (projectId: string, taskId: string, input: UpdateTaskInput) => {
  const response = await api.patch(`/projects/${projectId}/tasks/${taskId}`, input);
  return response.data.data;
};

export const deleteTask = async (projectId: string, taskId: string) => {
  await api.delete(`/projects/${projectId}/tasks/${taskId}`);
};
