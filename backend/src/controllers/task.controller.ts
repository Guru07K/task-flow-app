import { Request, Response } from "express";
import { createTask, deleteTask, getProjectTasks, getTask, updateTask } from "../services/task.service";

export const createTaskController = async (req: Request, res: Response): Promise<void> => {
  const task = await createTask(String(req.params.projectId), req.body, req.user!._id);

  res.status(201).json({
    message: "Task created successfully",
    data: task,
  });
};

export const getProjectTasksController = async (req: Request, res: Response): Promise<void> => {
  const tasks = await getProjectTasks(String(req.params.projectId), req.user!._id);

  res.status(200).json({
    data: tasks,
  });
};

export const getTaskController = async (req: Request, res: Response): Promise<void> => {
  const task = await getTask(String(req.params.taskId), String(req.params.projectId));

  res.status(200).json({
    data: task,
  });
};

export const updateTaskController = async (req: Request, res: Response): Promise<void> => {
  const task = await updateTask(String(req.params.taskId), String(req.params.projectId), req.body, req.user!._id);

  res.status(200).json({
    message: "Task updated successfully",
    data: task,
  });
};

export const deleteTaskController = async (req: Request, res: Response): Promise<void> => {
  await deleteTask(String(req.params.taskId), String(req.params.projectId));

  res.status(200).json({
    message: "Task deleted successfully",
  });
};
