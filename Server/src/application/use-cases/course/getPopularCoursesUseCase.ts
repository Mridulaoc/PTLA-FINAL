import { ICourse } from "../../../domain layer/entities/Course";
import { ICourseRepository } from "../../../infrastructure layer/database/repositories/courseRepo";

export class GetPopularCoursesUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(limit: number): Promise<ICourse[]> {
    return await this.courseRepository.getPopularCourses(limit);
  }
}
