import { INotification } from "../../../domain/entities/Notification";
import { INotificationRepository } from "../../../infrastructure/database/repositories/notificationRepo";
import { INotificationService } from "../../../infrastructure/services/socketServices/notificationSocketService";

export class CreateNotificationUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private notificationService: INotificationService
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

      // await new Promise((resolve) => setTimeout(resolve, 100));

      if (notification.targetType === "all") {
        this.notificationService.sendNotificationToAllUsers(savedNotification);
      } else if (targetUsers.length > 0) {
        this.notificationService.sendNotificationToUsers(
          targetUsers,
          savedNotification
        );
      } else {
        console.warn("No target users found for notification");
      }

      return savedNotification;
    } catch (error) {
      console.error(" Notification creation failed:", error);
      throw error;
    }
  }
}
