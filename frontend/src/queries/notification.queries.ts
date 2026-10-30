import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import notificationService from "../services/notification.service";

export const useNotifications = (page = 1, limit = 10, enabled = true) => {
  return useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: () => notificationService.getNotification(page, limit),
    enabled,
  });
};

export const useUnreadNotificationCount = (enabled = true) => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationService.getUnreadCount(),
    enabled,
    refetchInterval: 30_000,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
        queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] }),
      ]);
    },
  });
};
