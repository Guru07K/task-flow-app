import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../services/auth.service";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
};
