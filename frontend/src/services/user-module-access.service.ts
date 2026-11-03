import axios from "axios";
import api from "../api/axios";

export interface ModuleAccess {
  name: string;
  access: boolean;
  permissions: string[];
}

export interface UserModuleAccess {
  roleId: string;
  role: string;
  modules: ModuleAccess[];
}

export interface AssignUserModuleAccessInput {
  userId: string;
  roleId: string;
  modules: ModuleAccess[];
}

export const getUserModuleAccess = async (userId: string): Promise<UserModuleAccess | null> => {
  const res = await api.get(`/user-module-access/${userId}`);
  return res.data.data;
};

export const assignUserModuleAccess = async (input: AssignUserModuleAccessInput) => {
  const res = await api.post("/user-module-access", input);
  return res.data.data;
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};
