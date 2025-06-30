import { ICourse } from "../../../domain/entities/Course";
import { ICourseBundleRepository } from "../../../infrastructure/database/repositories/courseBundleRepo";

export class FetchAllCoursesUseCase {
  constructor(private courseBundleRepository: ICourseBundleRepository) {}
  async execute(): Promise<ICourse[] | null> {
    try {
      const result = await this.courseBundleRepository.fetchAllCourses();
      if (!result) {
        throw new Error("Error fetching courses");
      }
      return result;
    } catch (error) {
      return null;
    }
  }
}
