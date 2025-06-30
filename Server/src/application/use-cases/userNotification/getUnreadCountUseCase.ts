import { INotificationRepository } from "../../../infrastructure/database/repositories/notificationRepo";

export interface IGetUnreadNotificationCountInput {
  userId: string;
}

export interface IGetUnreadNotificationCountResponse {
  unreadCount: number;
}

export class GetUnreadNotificationCountUseCase {
  constructor(private notificationRepo: INotificationRepository) {}

  async execute(
    input: IGetUnreadNotificationCountInput
  ): Promise<IGetUnreadNotificationCountResponse> {
    const count = await this.notificationRepo.getUnreadCount(input.userId);
    return { unreadCount: count };
  }
}
