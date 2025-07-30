import { Socket } from "socket.io";
import { INotification } from "../../../domain/entities/Notification";
import { notificationNamespace } from "../../../app";

export interface INotificationService {
  handleNotificationSocketEvents(socket: Socket): void;
  sendNotificationToUsers(userIds: string[], notification: INotification): void;
  sendNotificationToAllUsers(notification: INotification): void;
}

export class NotificationSocketService implements INotificationService {
  private activeUsers: Map<string, string>;

  constructor(activeUsers?: Map<string, string>) {
    this.activeUsers = activeUsers ?? new Map();
  }

  handleNotificationSocketEvents = (socket: Socket) => {
    const user = socket.data.user;
    if (!user) {
      console.error("No user data found in socket");
      return;
    }

    socket.on("notification:read", async (notificationId: string) => {});
    socket.on("notification:read-all", async () => {});
  };

  sendNotificationToUsers = (
    userIds: string[],
    notification: INotification
  ) => {
    if (!userIds || userIds.length === 0) {
      return;
    }
    userIds.forEach((userId) => {
      try {
        console.log(this.activeUsers);
        const socketId = this.activeUsers.get(userId);
        if (socketId) {
          notificationNamespace
            .to(`user:${userId}`)
            .emit("notification:new", notification);
        }
      } catch (error) {
        console.error(` Error sending notification to user ${userId}:`, error);
      }
    });
  };

  sendNotificationToAllUsers = (notification: INotification) => {
    try {
      notificationNamespace.emit("notification:new", notification);
    } catch (error) {
      console.error(" Error sending notification to all users:", error);
    }
  };
}
