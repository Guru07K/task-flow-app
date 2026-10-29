import { Project } from "../schema/project.schema";
import {
  AddProjectMemberInput,
  CreateProjectInput,
  ProjectMemberRole,
  UpdateProjectInput,
  UpdateProjectMemberInput,
} from "../models/project.model";
import { ErrorHandler } from "../utils/error-handler";
import mongoose from "mongoose";
import { User } from "../schema/user.schema";

export const createProject = async (input: CreateProjectInput, userId: string) => {
  const project = await Project.create({
    name: input.name,
    description: input.description,
    owner: userId,
    members: [
      {
        user: userId,
        role: ProjectMemberRole.ADMIN,
      },
    ],
  });

  return project;
};

export const getMyProjects = async (userId: string) => {
  const projects = await Project.find({
    "members.user": userId,
  }).sort({ createdAt: -1 });

  return projects;
};

export const getProjectById = async (projectId: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ErrorHandler(400, "Invalid project ID");
  }

  const project = await Project.findOne({
    _id: projectId,
    "members.user": userId,
  });

  if (!project) {
    throw new ErrorHandler(404, "Project not found");
  }

  return project;
};

export const updateProject = async (projectId: string, input: UpdateProjectInput, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ErrorHandler(400, "Invalid project ID");
  }

  const project = await Project.findOne({
    _id: projectId,
    owner: userId,
  });

  if (!project) {
    throw new ErrorHandler(404, "Project not found or you are not the owner");
  }

  if (input.name !== undefined) {
    project.name = input.name;
  }

  if (input.description !== undefined) {
    project.description = input.description;
  }

  await project.save();

  return project;
};

export const deleteProject = async (projectId: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ErrorHandler(400, "Invalid project ID");
  }

  const project = await Project.findOneAndDelete({
    _id: projectId,
    owner: userId,
  });

  if (!project) {
    throw new ErrorHandler(404, "Project not found or you are not the owner");
  }

  return project;
};

export const addProjectMember = async (projectId: string, userId: string, input: AddProjectMemberInput) => {
  const project = await Project.findOne({ _id: projectId, owner: userId });
  if (!project) {
    throw new ErrorHandler(404, "Project not found or you are not the owner");
  }

  const user = await User.findOne({ email: input.email });
  if (!user) {
    throw new ErrorHandler(404, "User not found");
  }

  const isAlreadyMember = project.members.some((member) => {
    return member.user.toString() === user._id.toString();
  });
  if (isAlreadyMember) {
    throw new ErrorHandler(409, "User is already a project member");
  }

  project.members.push({
    user: user._id,
    role: input.role ?? ProjectMemberRole.MEMBER,
  });

  await project.save();

  return project;
};

export const getProjectMembers = async (projectId: string, userId: string) => {
  const project = await Project.findOne({ _id: projectId, "members.user": userId }).populate("members.user", "name email role");
  if (!project) {
    throw new ErrorHandler(404, "Project not found");
  }

  return project.members;
};

export const updateProjectMemberRole = async (projectId: string, input: UpdateProjectMemberInput, memberUserId: string, userId: string) => {
  const project = await Project.findOne({ _id: projectId, owner: userId });
  if (!project) {
    throw new ErrorHandler(404, "Project not found or you are not the owner");
  }

  if (project.owner.toString() === memberUserId) {
    throw new ErrorHandler(400, "Project owner role cannot be changed");
  }

  const member = project.members.find((member) => member.user.toString() === memberUserId);

  if (!member) {
    throw new ErrorHandler(404, "Project member not found");
  }

  if (input.role !== undefined) {
    member.role = input.role;
  }

  await project.save();

  return project;
};

export const removeProjectMember = async (projectId: string, memberUserId: string, userId: string) => {
  const project = await Project.findOne({
    _id: projectId,
    owner: userId,
  });

  if (!project) {
    throw new ErrorHandler(404, "Project not found or you are not the owner");
  }

  if (project.owner.toString() === memberUserId) {
    throw new ErrorHandler(400, "Project owner cannot be removed");
  }

  const memberExists = project.members.some((member) => member.user.toString() === memberUserId);

  if (!memberExists) {
    throw new ErrorHandler(404, "Project member not found");
  }

  project.members = project.members.filter((member) => member.user.toString() !== memberUserId);

  await project.save();

  return project;
};
