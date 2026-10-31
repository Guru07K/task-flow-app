import api from "../api/axios";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export const loginUser = async (input: LoginInput) => {
  const res = await api.post("/auth/login", input);
  return res.data;
};

export const registerUser = async (input: RegisterInput) => {
  const res = await api.post("/auth/register", input);
  return res.data;
};

export const logoutUser = async () => {
  await api.post("auth/logout");
};
