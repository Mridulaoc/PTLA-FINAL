import { ICourse } from "../../../domain layer/entities/Course";
import { ICourseRepository } from "../../../infrastructure layer/database/repositories/courseRepo";

export class AddCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(
    courseData: Omit<ICourse, "_id">
  ): Promise<{ courseId: string; message: string }> {
    try {
      const result = await this.courseRepository.create(courseData);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
    return { courseId: "", message: "Could not add basic details" };
  }
}
