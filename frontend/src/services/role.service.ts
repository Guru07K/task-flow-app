import api from "../api/axios";

export interface Role {
  _id: string;
  name: string;
  description?: string;
}

export const getRoles = async (): Promise<Role[]> => {
  const res = await api.get("/roles");
  return res.data.data;
};
