import { ICourse } from "../../../domain/entities/Course";
import { ICourseRepository } from "../../../infrastructure/database/repositories/courseRepo";

export class GetPublicCoursesUsecase {
  constructor(private courseRepository: ICourseRepository) {}
  async execute(
    page: number,
    limit: number,
    search: string,
    category: string,
    sort: string
  ): Promise<{ courses: ICourse[]; total: number }> {
    try {
      const result = await this.courseRepository.findPublicCourses(
        page,
        limit,
        search,
        category,
        sort
      );

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
