import mongoose from "mongoose";
import { IRedisCacheVersion } from "../models/redis-cache-version.model";

const redisCacheVersionSchema = new mongoose.Schema<IRedisCacheVersion>(
  {
    resource: {
      type: String,
      required: true,
      unique: true,
    },
    version: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
);

export const RedisCacheVersion = mongoose.model<IRedisCacheVersion>("RedisCahceVersion", redisCacheVersionSchema);
