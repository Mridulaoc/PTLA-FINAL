import { ICourse } from "../../../domain layer/entities/Course";
import { INotificationRepository } from "../../../infrastructure layer/database/repositories/notificationRepo";

export class FetchNotificationCourseUsecase {
  constructor(private notificationRepository: INotificationRepository) {}
  async execute(): Promise<ICourse[] | null> {
    try {
      const courses = await this.notificationRepository.fetchCourses();
      return courses;
    } catch (error) {
      throw new Error(`Error fetching courses: ${error}`);
    }
  }
}
