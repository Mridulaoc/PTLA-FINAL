import { Namespace } from "socket.io";
import { INotification } from "../../../domain/entities/Notification";
import { INotificationRepository } from "../../../infrastructure/database/repositories/notificationRepo";
import { INotificationService } from "../../../infrastructure/services/socketServices/notificationSocketService";

export class CreateNotificationUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private notificationService: INotificationService,
    private notificationNameSpace: Namespace
  ) {}
  async execute(
    notificationData: Omit<INotification, "_id">
  ): Promise<INotification> {
    try {
      let targetUsers: string[] = [];
      if (
        notificationData.targetType === "specific" &&
        notificationData.targetUsers
      ) {
        targetUsers = notificationData.targetUsers;
      } else if (
        notificationData.targetType !== "all" &&
        notificationData.targetEntity
      ) {
        targetUsers = await this.notificationRepository.fetchTargetUsers(
          notificationData.targetType,
          notificationData.targetEntity
        );
      }

      const notification = {
        title: notificationData.title,
        message: notificationData.message,
        targetType: notificationData.targetType,
        ...(notificationData.targetType !== "specific" &&
        notificationData.targetEntity
          ? { targetEntity: notificationData.targetEntity }
          : {}),
        targetUsers: targetUsers,
        isRead: false,
      };
      const savedNotification = await this.notificationRepository.create(
        notification
      );

      if (notification.targetType === "all") {
        this.notificationService.sendNotificationToAllUsers(
          this.notificationNameSpace,
          savedNotification
        );
      } else if (targetUsers.length > 0) {
        this.notificationService.sendNotificationToUsers(
          this.notificationNameSpace,
          targetUsers,
          savedNotification
        );
      }

      return savedNotification;
    } catch (error) {
      throw new Error(`Failed to create notification: ${error}`);
    }
  }
}
