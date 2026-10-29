import mongoose from "mongoose";
import { Project } from "../schema/project.schema";
import { ProjectMemberRole } from "../models/project.model";
import { CreateTaskInput, UpdateTaskInput } from "../models/task.model";
import { ErrorHandler } from "../utils/error-handler";
import { Task } from "../schema/task.schema";
import { Outbox } from "../schema/outbox.schema";
import { OutboxStatus } from "../models/outbox.model";

export const createTask = async (projectId: string, input: CreateTaskInput, userId: string) => {
  const project = await Project.findOne({
    _id: projectId,
    "members.user": userId,
  });

  if (!project) {
    throw new ErrorHandler(404, "Project not found");
  }

  const member = project.members.find((member) => member.user.toString() === userId.toString());

  if (!member || ![ProjectMemberRole.ADMIN, ProjectMemberRole.MANAGER, ProjectMemberRole.TL].includes(member.role)) {
    throw new ErrorHandler(403, "You do not have permission to create tasks");
  }

  if (input.assignedTo) {
    const isValidAssignedUser = project.members.some((member) => member.user.toString() === String(input.assignedTo));

    if (!isValidAssignedUser) {
      throw new ErrorHandler(400, "Assigned user is not a member of this project");
    }
  }

  const session = await mongoose.startSession();

  try {
    let createdTask: InstanceType<typeof Task> | undefined;

    await session.withTransaction(async () => {
      const [task] = await Task.create(
        [
          {
            ...input,
            project: projectId,
            createdBy: userId,
          },
        ],
        { session },
      );

      createdTask = task;

      if (input.assignedTo) {
        await Outbox.create(
          [
            {
              eventId: new mongoose.Types.ObjectId().toString(),
              eventType: "task.assigned",
              version: 1,
              occurredAt: new Date(),
              data: {
                taskId: task._id.toString(),
                projectId,
                assignedTo: String(input.assignedTo),
                assignedBy: userId.toString(),
              },
              status: OutboxStatus.PENDING,
              attempts: 0,
              nextAttemptAt: new Date(),
            },
          ],
          { session },
        );
      }
    });

    if (!createdTask) {
      throw new ErrorHandler(500, "Failed to create task");
    }

    return createdTask;
  } finally {
    await session.endSession();
  }
};

export const updateTask = async (taskId: string, projectId: string, input: UpdateTaskInput, userId: string) => {
  const session = await mongoose.startSession();

  try {
    let updatedTask: InstanceType<typeof Task> | undefined;

    await session.withTransaction(async () => {
      const task = await Task.findOne({
        _id: taskId,
        project: projectId,
      }).session(session);

      if (!task) {
        throw new ErrorHandler(404, "Task not found");
      }

      const project = await Project.findById(projectId).session(session);

      if (!project) {
        throw new ErrorHandler(404, "Project not found");
      }

      const previousAssignee = task.assignedTo ? task.assignedTo.toString() : null;

      const assignmentWasProvided = Object.prototype.hasOwnProperty.call(input, "assignedTo");

      const nextAssignee =
        assignmentWasProvided && input.assignedTo ? String(input.assignedTo) : assignmentWasProvided ? null : previousAssignee;

      if (nextAssignee) {
        const isValidAssignedUser = project.members.some((member) => member.user.toString() === nextAssignee);

        if (!isValidAssignedUser) {
          throw new ErrorHandler(400, "Assigned user is not a member of this project");
        }
      }

      Object.assign(task, input);
      await task.save({ session });

      const isNewAssignment = assignmentWasProvided && nextAssignee !== null && nextAssignee !== previousAssignee;

      if (isNewAssignment) {
        await Outbox.create(
          [
            {
              eventId: new mongoose.Types.ObjectId().toString(),
              eventType: "task.assigned",
              version: 1,
              occurredAt: new Date(),
              data: {
                taskId: task._id.toString(),
                projectId,
                assignedTo: nextAssignee,
                assignedBy: userId.toString(),
              },
              status: OutboxStatus.PENDING,
              attempts: 0,
              nextAttemptAt: new Date(),
            },
          ],
          { session },
        );
      }

      updatedTask = task;
    });

    if (!updatedTask) {
      throw new ErrorHandler(500, "Failed to update task");
    }

    return updatedTask;
  } finally {
    await session.endSession();
  }
};
