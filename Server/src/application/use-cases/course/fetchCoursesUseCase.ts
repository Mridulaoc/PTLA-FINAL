import { ICourse } from "../../../domain layer/entities/Course";
import { ICourseRepository } from "../../../infrastructure layer/database/repositories/courseRepo";

export class FetchCoursesUseCase {
  constructor(private courseRepository: ICourseRepository) {}
  async execute(
    page: number,
    limit: number
  ): Promise<{ courses: ICourse[]; total: number }> {
    try {
      const result = await this.courseRepository.fetchCourses(page, limit);

      if (!result) {
        throw new Error("Error fetching courses");
      }
      return result;
    } catch (error) {
      return {
        courses: [],
        total: 0,
      };
    }
  }
}
