import type { Request, Response, NextFunction } from "express";
import { getNotifications, getUnreadCount, markNotificationAsRead } from "../services/notification.service";

export const getNotificationsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pageParam = req.query.page ?? "1";
    const limitParam = req.query.limit ?? "10";

    const page = Number(pageParam);
    const limit = Number(limitParam);

    if (page < 1 || limit < 1 || limit > 100) {
      res.status(400).json({
        message: "page must be a positive integer and limit must be between 1 and 100",
      });
      return;
    }

    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    console.log("userId", userId);

    const result = await getNotifications({
      userId,
      page,
      limit,
    });

    res.status(200).json({
      message: "Notifications retrieved successfully",
      data: result.notifications,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCountControler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const count = await getUnreadCount(userId);

    res.status(200).json({
      message: "Unread notification count retrieved successfully",
      data: { count },
    });
  } catch (error) {
    next(error);
  }
};

export const markNotrificationAsReadController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const notificationId = req.params.id;

    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const notification = await markNotificationAsRead(String(notificationId), userId);

    if (!notification) {
      res.status(404).json({
        message: "Notification not found",
      });
      return;
    }
    res.status(200).json({
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};
