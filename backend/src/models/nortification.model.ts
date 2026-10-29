import mongoose, { Document, Schema } from "mongoose";

export interface NotificationDocument extends Document {
  eventId: string;
  recipientId: string;
  eventType: "task.assigned";
  taskId: string;
  projectId: string;
  assignedBy: string;
  isRead: boolean;
  readAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
