import { INotificationRepository } from "../../../infrastructure layer/database/repositories/notificationRepo";

export interface GetUserNotificationsInput {
  userId: string;
  page: number;
  limit: number;
}

export interface GetUserNotificationsOutput {
  notifications: any[];
  total: number;
  page: number;
  limit: number;
}

export class GetUserNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(
    input: GetUserNotificationsInput
  ): Promise<GetUserNotificationsOutput> {
    const { userId, page, limit } = input;

    const { notifications, total } =
      await this.notificationRepository.getUserNotifications(
        userId,
        page,
        limit
      );

    return {
      notifications,
      total,
      page,
      limit,
    };
  }
}
