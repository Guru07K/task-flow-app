import { Types } from "mongoose";

export enum ProjectMemberRole {
  ADMIN = "admin",
  MEMBER = "member",
  MANAGER = "manager",
  TL = "tl",
}

export interface IProjectMember {
  user: Types.ObjectId;
  role: ProjectMemberRole;
}

export interface IProject {
  name: string;
  description?: string;
  owner: Types.ObjectId;
  members: IProjectMember[];
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {}

export interface AddProjectMemberInput {
  email: string;
  role?: ProjectMemberRole;
}

export interface UpdateProjectMemberInput extends Pick<AddProjectMemberInput, "role"> {}
