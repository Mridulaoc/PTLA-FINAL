import { ICourse } from "../../../domain layer/entities/Course";
import { ICourseRepository } from "../../../infrastructure layer/database/repositories/courseRepo";

export class UpdateCourseDetailsUseCase {
  constructor(private courseRepository: ICourseRepository) {}
  async execute(
    courseId: string,
    courseData: Partial<ICourse>
  ): Promise<ICourse | null> {
    try {
      const existingCourse = await this.courseRepository.findCourseById(
        courseId
      );

      if (!existingCourse) {
        throw new Error("Course not found");
      }

      const updatedCourse = await this.courseRepository.updateCourse(
        courseId,
        courseData
      );
      return updatedCourse;
    } catch (error) {
      return null;
    }
  }
}
