import { IUser } from "../../../domain layer/entities/User";
import { ICourseRepository } from "../../../infrastructure layer/database/repositories/courseRepo";
import { IUserRepository } from "../../../infrastructure layer/database/repositories/userRepo";

export class EnrollUserUsecase {
  constructor(
    private userRepo: IUserRepository,
    private courseRepo: ICourseRepository
  ) {}

  async execute(
    userId: string,
    courseId: string,
    enrollmentType: "manual" | "auto"
  ): Promise<IUser | null> {
    try {
      const user = await this.userRepo.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const course = await this.courseRepo.findCourseById(courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      const isEnrolled = user.enrolledCourses?.some(
        (enrollment) => enrollment.courseId.toString() === courseId
      );
      if (isEnrolled) {
        throw new Error("User is already enrolled in this course");
      }
      const updatedUser = await this.userRepo.enrollUser(
        userId,
        courseId,
        enrollmentType
      );

      if (!updatedUser) {
        throw new Error("Failed to enroll user");
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Enrollment error: ${error.message}`);
        throw error;
      }
      throw new Error("An unknown error occurred during enrollment");
    }
  }
}
