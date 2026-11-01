import mongoose, { Document } from "mongoose";

export interface IRole extends Document {
  name: string;
  description?: string;
}

const roleSchema = new mongoose.Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Role = mongoose.model<IRole>("Role", roleSchema);
