import { Notification } from "../schema/notication.schema";

interface GetNotificationsInput {
  userId: string;
  page: number;
  limit: number;
}

export const getNotifications = async ({ userId, page, limit }: GetNotificationsInput) => {
  const [notifications, total] = await Promise.all([
    Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ recipientId: userId }),
  ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUnreadCount = async (userId: string) => {
  return Notification.countDocuments({
    recipientId: userId,
    isRead: false,
  });
};

export const markNotificationAsRead = async (notificationId: string, userId: string) => {
  const isNotificationExsist = await Notification.findById(notificationId);
  if (!isNotificationExsist) {
    throw new Error("Invalid notification id");
  }

  const notification = await Notification.findByIdAndUpdate(
    {
      _id: notificationId,
      recipientId: userId,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
    { returnDocument: "after", runValidators: true },
  );

  return notification;
};
