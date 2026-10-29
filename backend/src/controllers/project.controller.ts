import { Request, Response } from "express";
import {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  getProjectMembers,
  updateProjectMemberRole,
  removeProjectMember,
} from "../services/project.service";

export const createProjectController = async (req: Request, res: Response): Promise<void> => {
  const project = await createProject(req.body, req.user!._id);

  res.status(201).json({
    message: "Project created successfully",
    data: project,
  });
};

export const getMyProjectsController = async (req: Request, res: Response): Promise<void> => {
  const projects = await getMyProjects(req.user!._id);

  res.status(200).json({
    data: projects,
  });
};

export const getProjectController = async (req: Request, res: Response): Promise<void> => {
  const project = await getProjectById(String(req.params.id), req.user!._id);

  res.status(200).json({
    data: project,
  });
};

export const updateProjectController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const project = await updateProject(req.params.id, req.body, req.user!._id);

  res.status(200).json({
    message: "Project updated successfully",
    data: project,
  });
};

export const deleteProjectController = async (req: Request, res: Response): Promise<void> => {
  await deleteProject(String(req.params.id), req.user!._id);

  res.status(200).json({
    message: "Project deleted successfully",
  });
};

export const addProjectMemberController = async (req: Request, res: Response) => {
  const project = await addProjectMember(String(req.params.id), req.user!._id, req.body);
  res.status(200).json({
    message: "Member added successfully",
    data: project,
  });
};

export const getProjectMembersController = async (req: Request, res: Response) => {
  const members = await getProjectMembers(String(req.params.id), req.user!._id);

  res.status(200).json({
    data: members,
  });
};

export const updateProjectMemberRoleController = async (req: Request, res: Response): Promise<void> => {
  const project = await updateProjectMemberRole(String(req.params.id), req.body, String(req.params.userId), req.user!._id);
  res.status(200).json({
    message: "Member role updated successfully",
    data: project,
  });
};

export const removeProjectMemberController = async (req: Request, res: Response): Promise<void> => {
  await removeProjectMember(String(req.params.id), String(req.params.userId), req.user!._id);

  res.status(200).json({
    message: "Member removed successfully",
  });
};
