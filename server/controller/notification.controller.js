import Notification from "../models/Notification.js";

export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(30)
      .populate("user", "name email")
      .populate("order", "totalAmount");

    const unreadCount = await Notification.countDocuments({ readAt: null });

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.error("Get Admin Notifications Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { readAt: null },
      { $set: { readAt: new Date() } },
    );

    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Mark Notifications Read Error:", error);
    res.status(500).json({ message: error.message });
  }
};
