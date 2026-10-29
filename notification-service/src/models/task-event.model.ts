export interface TaskAssignedEventData {
  taskId: string;
  projectId: string;
  assignedTo: string;
  assignedBy: string;
}

export interface TaskAssignedEvent {
  version: 1;
  eventId: string;
  eventType: "task.assigned";
  occurredAt: string;
  data: TaskAssignedEventData;
}

export type TaskEvent = TaskAssignedEvent;
