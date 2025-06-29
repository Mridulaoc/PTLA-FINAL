import { IUser } from "../../../domain layer/entities/User";
import { INotificationRepository } from "../../../infrastructure layer/database/repositories/notificationRepo";

export class FetchNotificationUsersUseCase {
  constructor(private notificationRepository: INotificationRepository) {}
  async execute(): Promise<IUser[] | null> {
    try {
      const user = await this.notificationRepository.fetchUsers();
      if (!user) {
        throw new Error("No users found");
      }
      return user;
    } catch (error) {
      throw new Error(`Erron fetching users${error}`);
    }
  }
}
