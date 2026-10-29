import { Schema, model } from "mongoose";
import { IProject, ProjectMemberRole } from "../models/project.model";

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        role: {
          type: String,
          enum: Object.values(ProjectMemberRole),
          default: ProjectMemberRole.MEMBER,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Project = model<IProject>("Project", projectSchema);
