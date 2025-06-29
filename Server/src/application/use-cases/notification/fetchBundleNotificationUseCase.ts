import { ICourseBundle } from "../../../domain layer/entities/CourseBundle";
import { INotificationRepository } from "../../../infrastructure layer/database/repositories/notificationRepo";

export class FetchBundleNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}
  async execute(): Promise<{ bundles: ICourseBundle[]; total: number }> {
    try {
      const result = await this.notificationRepository.fetchBundles();
      return result;
    } catch (error) {
      throw new Error(`Error fetching bundle: ${error}`);
    }
  }
}
