import { Namespace, Server, Socket } from "socket.io";
import { INotification } from "../../../domain/entities/Notification";

export interface INotificationService {
  handleNotificationSocketEvents(
    socket: Socket,
    namespace: Namespace | Server
  ): void;

  sendNotificationToUsers(
    namespace: Namespace | Server,
    userIds: string[],
    notification: INotification
  ): void;

  sendNotificationToAllUsers(
    namespace: Namespace | Server,
    notification: INotification
  ): void;
}

export class NotificationSocketService implements INotificationService {
  handleNotificationSocketEvents = (
    socket: Socket,
    namespace: Namespace | Server
  ) => {
    const user = socket.data.user;
    if (!user) {
      return;
    }

    if (user.type === "admin") {
      socket.join("admin");
    } else {
      socket.join(`user:${user.id}`);
    }

    socket.on("notification:read", async (notificationId: string) => {});

    socket.on("notification:read-all", async () => {});
  };

  sendNotificationToUsers = (
    namespace: Namespace | Server,
    userIds: string[],
    notification: INotification
  ) => {
    if (!userIds || userIds.length === 0) return;
    userIds.forEach((userId) => {
      namespace.to(`user:${userId}`).emit("notification:new", notification);
    });
  };

  sendNotificationToAllUsers = (
    namespace: Namespace | Server,
    notification: INotification
  ) => {
    namespace.emit("notification:new", notification);
  };
}
