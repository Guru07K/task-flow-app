import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../services/role.service";

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });
};
