import { Request, Response } from "express";
import { createTask, deleteTask, getProjectTasks, getTask, updateTask } from "../services/task.service";

export class TaskController {
  async createTask(req: Request, res: Response) {
    const task = await createTask(String(req.params.projectId), req.body, req.user!._id);

    res.status(201).json({
      message: "Task created successfully",
      data: task,
    });
  }

  async getProjectTasks(req: Request, res: Response) {
    const tasks = await getProjectTasks(String(req.params.projectId), req.user!._id);

    res.status(200).json({
      data: tasks,
    });
  }

  async getTask(req: Request, res: Response) {
    const task = await getTask(String(req.params.taskId), String(req.params.projectId));

    res.status(200).json({
      data: task,
    });
  }

  async updateTask(req: Request, res: Response) {
    const task = await updateTask(String(req.params.taskId), String(req.params.projectId), req.body, req.user!._id);

    res.status(200).json({
      message: "Task updated successfully",
      data: task,
    });
  }

  async deleteTask(req: Request, res: Response) {
    await deleteTask(String(req.params.taskId), String(req.params.projectId));

    res.status(200).json({
      message: "Task deleted successfully",
    });
  }
}
