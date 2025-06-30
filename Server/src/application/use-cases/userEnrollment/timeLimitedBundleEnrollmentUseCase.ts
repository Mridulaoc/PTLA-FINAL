import { ICourseRepository } from "../../../infrastructure/database/repositories/courseRepo";
import { IUserRepository } from "../../../infrastructure/database/repositories/userRepo";

export class TimeLimitedBundleEnrollmentUseCase {
  constructor(
    private userRepository: IUserRepository,
    private courseRepository: ICourseRepository
  ) {}

  async execute(
    userId: string,
    bundleId: string,
    courses: string[],
    expiryDate: Date,
    enrollmentType: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.userRepository.createBundleEnrollment(
        userId,
        bundleId,
        expiryDate,
        enrollmentType
      );

      for (const courseId of courses) {
        const isAlreadyEnrolled =
          await this.userRepository.checkCourseEnrollment(userId, courseId);

        if (isAlreadyEnrolled) {
          await this.userRepository.updateCourseEnrollment(
            userId,
            courseId,
            bundleId,
            expiryDate
          );
        } else {
          await this.userRepository.createCourseEnrollment(
            userId,
            courseId,
            bundleId,
            expiryDate,
            enrollmentType
          );

          await this.courseRepository.updateStudentsEnrolled(courseId, userId);
        }
      }

      return { success: true, message: "Enrolled in time-limited bundle" };
    } catch (error) {
      console.error("Error in time-limited bundle enrollment use case:", error);
      throw new Error("Failed to enroll user in time-limited bundle");
    }
  }
}
