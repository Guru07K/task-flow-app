import { Types } from "mongoose";

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface ITask {
  title: string;
  description?: string;
  project: Types.ObjectId;
  assignedTo?: Types.ObjectId | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | null;
  createdBy: Types.ObjectId;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  assignedTo?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {}
