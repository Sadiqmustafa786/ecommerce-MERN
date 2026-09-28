import { create } from "zustand";
import notificationService from "../services/notification.service";

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    try {
      set({ loading: true });
      const response = await notificationService.getAdminNotifications();

      set({
        notifications: response.notifications,
        unreadCount: response.unreadCount,
      });
    } finally {
      set({ loading: false });
    }
  },

  markAllRead: async () => {
    await notificationService.markNotificationsRead();
    set({ unreadCount: 0 });
  },
}));

export default useNotificationStore;
