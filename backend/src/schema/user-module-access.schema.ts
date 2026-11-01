import mongoose from "mongoose";
import type { IUserModuleAccess, IModuleAccess } from "../models/user-module-access.model";

const moduleAccessSchema = new mongoose.Schema<IModuleAccess>(
  {
    name: {
      type: String,
      required: true,
    },
    access: {
      type: Boolean,
      required: true,
      default: false,
    },
    permissions: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const userModuleAccessSchema = new mongoose.Schema<IUserModuleAccess>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  modules: {
    type: [moduleAccessSchema],
    default: [],
    validate: {
      validator: (modules: IModuleAccess[]) => {
        const names = modules.map((module) => module.name);
        return names.length === new Set(names).size;
      },
      message: "Duplicate modules are not allowed.",
    },
  },
});

// userModuleAccessSchema.index({ userId: 1 });
export const UserModuleAccess = mongoose.model<IUserModuleAccess>("UserModuleAccess", userModuleAccessSchema);
