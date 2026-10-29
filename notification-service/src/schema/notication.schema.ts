import mongoose, { Schema } from "mongoose";
import { NotificationDocument } from "../models/notification.model";

const notificationSchema = new Schema<NotificationDocument>(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
    },
    recipientId: {
      type: String,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: ["task.assigned"],
    },
    taskId: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    assignedBy: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      required: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<NotificationDocument>("Notification", notificationSchema);
