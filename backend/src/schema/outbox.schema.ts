import mongoose from "mongoose";
import { OutboxEvent, OutboxStatus } from "../models/outbox.model";

const outboxSchema = new mongoose.Schema<OutboxEvent>(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      required: true,
      default: 1,
    },
    occurredAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    data: {
      taskId: {
        type: String,
        required: true,
      },
      projectId: {
        type: String,
        required: true,
      },
      assignedTo: {
        type: String,
        required: true,
      },
      assignedBy: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: Object.values(OutboxStatus),
      default: OutboxStatus.PENDING,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
    },
    nextAttemptAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    publishedAt: {
      type: Date,
    },
    lastError: {
      type: String,
    },
    processingStartedAt: {
      type: Date,
      default: null,
    },
    maxAttempts: {
      type: Number,
      default: 10,
      required: true,
      min: 1,
    },
  },
  { timestamps: true, versionKey: false },
);

outboxSchema.index({
  status: 1,
  nextAttemptAt: 1,
  createdAt: 1,
});

export const Outbox = mongoose.model("Outbox", outboxSchema);
