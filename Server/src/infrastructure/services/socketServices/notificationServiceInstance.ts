import { NotificationSocketService } from "../socketServices/notificationSocketService";

export const activeNotificationUsers = new Map<string, string>();
export const notificationService = new NotificationSocketService(
  activeNotificationUsers
);
