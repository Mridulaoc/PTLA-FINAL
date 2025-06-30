import { INotificationRepository } from "../../../infrastructure layer/database/repositories/notificationRepo";

export interface MarkNotificationAsReadInput {
  notificationId: string;
  userId: string;
}

export interface MarkNotificationAsReadResponse {
  success: boolean;
  message: string;
}

export class MarkNotificationAsReadUseCase {
  constructor(private notificationRepo: INotificationRepository) {}

  async execute(
    input: MarkNotificationAsReadInput
  ): Promise<MarkNotificationAsReadResponse> {
    const { notificationId, userId } = input;

    const notification = await this.notificationRepo.findById(notificationId);
    if (!notification) {
      return {
        success: false,
        message: "Notification not found",
      };
    }

    const updated = await this.notificationRepo.markAsRead(
      notificationId,
      userId
    );
    if (!updated) {
      return {
        success: false,
        message: "Failed to mark notification as read",
      };
    }

    return {
      success: true,
      message: "Notification marked as read",
    };
  }
}
