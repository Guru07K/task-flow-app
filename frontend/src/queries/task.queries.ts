import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  getProjectTasks,
  getTask,
  updateTask,
  type CreateTaskInput,
  type UpdateTaskInput,
} from "../services/task.service";

export const useProjectTasks = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", "tasks", projectId],
    queryFn: () => getProjectTasks(projectId),
    enabled: Boolean(projectId),
  });
};

export const useTask = (projectId: string, taskId: string) => {
  return useQuery({
    queryKey: ["projects", "tasks", projectId, taskId],
    queryFn: () => getTask(projectId, taskId),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, input }: { projectId: string; input: CreateTaskInput }) => createTask(projectId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", "tasks", variables.projectId],
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, taskId, input }: { projectId: string; taskId: string; input: UpdateTaskInput }) =>
      updateTask(projectId, taskId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", "tasks", variables.projectId, variables.taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", "tasks", variables.projectId],
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, taskId }: { projectId: string; taskId: string }) => deleteTask(projectId, taskId),
    onSuccess(data, variables) {
      queryClient.invalidateQueries({
        queryKey: ["projects", "tasks", variables.projectId, variables.taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", "tasks", variables.projectId],
      });
    },
  });
};
