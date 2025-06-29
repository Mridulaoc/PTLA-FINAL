import { ICourseRepository } from "../../../infrastructure layer/database/repositories/courseRepo";

export class DeleteCourseUsecase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(
    courseId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const course = await this.courseRepository.findCourseById(courseId);
      if (!course) {
        return { success: false, message: "Course not found." };
      }

      const deleted = await this.courseRepository.delete(courseId);
      if (!deleted) {
        return { success: false, message: "Failed to delete course." };
      }
      return { success: true, message: "Course deleted successfully." };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while deleting the course",
      };
    }
  }
}
