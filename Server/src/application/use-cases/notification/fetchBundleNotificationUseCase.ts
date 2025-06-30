import { ICourseBundle } from "../../../domain/entities/CourseBundle";
import { INotificationRepository } from "../../../infrastructure/database/repositories/notificationRepo";

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
