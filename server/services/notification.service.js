import Notification from "../models/Notification.js";

export const createNotification = async (data) => {
  try {
    await Notification.create(data);
  } catch (error) {
    console.error("Create Notification Error:", error);
  }
};
