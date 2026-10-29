import { TaskAssignedEventData, TaskAssignedEvent } from "../models/task-event.model";

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

const isValidIsoDate = (value: unknown): value is string => {
  if (typeof value !== "string") {
    return false;
  }

  const timestamp = Date.parse(value);

  return Number.isFinite(timestamp) && new Date(timestamp).toISOString() === value;
};

const isTaskAssignedEventData = (value: unknown): value is TaskAssignedEventData => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.taskId) &&
    isNonEmptyString(value.projectId) &&
    isNonEmptyString(value.assignedTo) &&
    isNonEmptyString(value.assignedBy)
  );
};

export const validateTaskEvent = (value: unknown): TaskAssignedEvent => {
  if (!isRecord(value)) {
    throw new Error("Task event must be a JSON object");
  }

  if (value.version !== 1) {
    throw new Error("Unsupported task event version");
  }

  if (value.eventType !== "task.assigned") {
    throw new Error("Unsupported task event type");
  }

  if (!isNonEmptyString(value.eventId) || !isValidIsoDate(value.occurredAt) || !isTaskAssignedEventData(value.data)) {
    throw new Error("Invalid task.assigned event payload");
  }

  return value as unknown as TaskAssignedEvent;
};
