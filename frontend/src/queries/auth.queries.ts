import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../services/auth.service";

export const useUsers = (enabled = true) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    enabled,
  });
};
