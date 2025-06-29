import { ICourse } from "../../../domain layer/entities/Course";
import { ICourseRepository } from "../../../infrastructure layer/database/repositories/courseRepo";

export class FetchCourseDetailsUseCase {
  constructor(private courseRepository: ICourseRepository) {}
  async execute(courseId: string): Promise<ICourse | null> {
    try {
      const course = await this.courseRepository.findCourseById(courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      return course;
    } catch (error) {
      return null;
    }
  }
}
