import { INotificationRepository } from "../../../infrastructure layer/database/repositories/notificationRepo";

export class DeleteNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}
  async execute(id: string): Promise<{ message: string; id: string }> {
    try {
      const isDeleted = await this.notificationRepository.delete(id);
      return { message: "Notification deleted successfully", id };
    } catch (error) {
      throw new Error(`Error deleting notification${error}`);
    }
  }
}
