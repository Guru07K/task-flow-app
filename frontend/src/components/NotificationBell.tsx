import { useState } from "react";
import { useMarkNotificationAsRead, useNotifications, useUnreadNotificationCount } from "../queries/notification.queries";

const formatDate = (value: string) => new Date(value).toLocaleString();

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { data, isPending, isError, refetch } = useNotifications(page, 10, isOpen);
  const markAsReadMutation = useMarkNotificationAsRead();

  const notifications = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={isOpen}
        className="relative rounded-full p-2 text-gray-700 hover:bg-gray-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-600 px-1 text-center text-xs font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white shadow-xl sm:w-96">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <h2 className="font-semibold text-gray-900">Notifications</h2>
              <p className="text-xs text-gray-500">{unreadCount} unread</p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
              aria-label="Close notifications"
            >
              ✕
            </button>
          </div>

          {isPending && <p className="p-5 text-sm text-gray-500">Loading notifications...</p>}

          {isError && (
            <div className="p-4 text-sm text-red-600">
              Could not load notifications.
              <button type="button" onClick={() => void refetch()} className="ml-2 underline">
                Retry
              </button>
            </div>
          )}

          {!isPending && !isError && notifications.length === 0 && (
            <p className="p-6 text-center text-sm text-gray-500">You're all caught up!</p>
          )}

          <ul className="max-h-96 divide-y divide-gray-100 overflow-y-auto">
            {notifications.map((notification: any) => (
              <li key={notification._id} className={`p-4 ${notification.isRead ? "bg-white" : "bg-blue-50"}`}>
                <div className="flex items-start gap-3">
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notification.isRead ? "bg-gray-300" : "bg-blue-600"}`} />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">Task assigned to you</p>

                    <p className="mt-1 text-sm text-gray-600">A new task has been assigned to you.</p>

                    <p className="mt-2 text-xs text-gray-400">{formatDate(notification.createdAt)}</p>

                    {!notification.isRead && (
                      <button
                        type="button"
                        disabled={markAsReadMutation.isPending}
                        onClick={() => markAsReadMutation.mutate(notification._id)}
                        className="mt-2 text-xs font-medium text-blue-700 hover:underline disabled:opacity-50"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-md border px-3 py-1 text-sm disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-xs text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-md border px-3 py-1 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
