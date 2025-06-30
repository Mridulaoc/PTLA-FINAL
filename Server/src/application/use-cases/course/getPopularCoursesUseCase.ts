import { ICourse } from "../../../domain/entities/Course";
import { ICourseRepository } from "../../../infrastructure/database/repositories/courseRepo";

export class GetPopularCoursesUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(limit: number): Promise<ICourse[]> {
    return await this.courseRepository.getPopularCourses(limit);
  }
}
