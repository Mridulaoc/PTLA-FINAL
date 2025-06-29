import { INotificationRepository } from "../../../infrastructure layer/database/repositories/notificationRepo";

export interface IMarkAllNotificationsAsReadInput {
  userId: string;
}

export interface IMarkAllNotificationsAsReadResponse {
  success: boolean;
  message: string;
}

export class MarkAllNotificationsAsReadUseCase {
  constructor(private notificationRepo: INotificationRepository) {}

  async execute(
    input: IMarkAllNotificationsAsReadInput
  ): Promise<IMarkAllNotificationsAsReadResponse> {
    const updated = await this.notificationRepo.markAllAsRead(input.userId);

    if (updated) {
      return {
        success: true,
        message: "All notifications marked as read",
      };
    } else {
      return {
        success: false,
        message: "Failed to mark all notifications as read",
      };
    }
  }
}
