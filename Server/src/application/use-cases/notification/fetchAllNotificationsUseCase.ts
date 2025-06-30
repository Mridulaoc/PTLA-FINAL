import { INotification } from "../../../domain/entities/Notification";
import { INotificationRepository } from "../../../infrastructure/database/repositories/notificationRepo";

export class FetchALLNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}
  async execute(
    page: number,
    limit: number
  ): Promise<{ notifications: INotification[]; total: number }> {
    try {
      const { notifications, total } =
        await this.notificationRepository.fetchAllNotifications(page, limit);
      return { notifications, total };
    } catch (error) {
      throw new Error("Failed to fetch all notifications");
    }
  }
}
