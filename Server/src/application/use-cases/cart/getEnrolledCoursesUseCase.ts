import { IEnrolledCourse } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/userRepo";

export class GetEnrolledCoursesUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(userId: string): Promise<IEnrolledCourse[] | null> {
    try {
      const enrolledCourses = await this.userRepository.getEnrolledCourses(
        userId
      );
      return enrolledCourses;
    } catch (error) {
      throw new Error("Error in fetching enrolled courses");
    }
  }
}
