import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignUserModuleAccess, getUserModuleAccess } from "../services/user-module-access.service";

export const useUserModuleAccess = (userId: string) => {
  return useQuery({
    queryKey: ["user-module-access", userId],
    queryFn: () => getUserModuleAccess(userId),
    enabled: Boolean(userId),
  });
};

export const useAssignUserModuleAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignUserModuleAccess,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user-module-access", variables.userId],
      });
    },
  });
};
