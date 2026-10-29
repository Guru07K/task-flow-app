import { Document } from "mongoose";

export enum OutboxStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  PUBLISHED = "published",
  FAILED = "failed",
}

export interface OutboxEventData {
  taskId: string;
  projectId: string;
  assignedTo: string;
  assignedBy: string;
}

export interface OutboxEvent extends Document {
  eventId: string;
  eventType: string;
  version: number;
  occurredAt: Date;
  data: OutboxEventData;
  status: OutboxStatus;
  attempts: number;
  nextAttemptAt: Date;
  publishedAt?: Date;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
  processingStartedAt: Date;
  maxAttempts: number;
}
