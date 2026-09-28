import http from "./http";

const getAdminNotifications = async () => {
  const response = await http.get("/notifications/admin");

  return response.data;
};

const markNotificationsRead = async () => {
  const response = await http.put("/notifications/admin/read");

  return response.data;
};

const notificationService = {
  getAdminNotifications,
  markNotificationsRead,
};

export default notificationService;
