import { IUser } from "../../../domain/entities/User";
import { ICourseBundleRepository } from "../../../infrastructure/database/repositories/courseBundleRepo";
import { ICourseRepository } from "../../../infrastructure/database/repositories/courseRepo";
import { IUserRepository } from "../../../infrastructure/database/repositories/userRepo";

export class PermanentBundleEnrollmentUseCase {
  constructor(
    private userRepository: IUserRepository,
    private courseRepository: ICourseRepository,
    private bundleRepository: ICourseBundleRepository
  ) {}

  async execute(
    userId: string,
    bundleId: string,
    courseIds: string[],
    enrollmentType: "manual" | "auto"
  ): Promise<IUser | null> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const bundle = await this.bundleRepository.findBundleById(bundleId);
      if (!bundle) {
        throw new Error("Bundle not found");
      }

      const permanentDate: Date | null = null;

      await this.userRepository.createBundleEnrollment(
        userId,
        bundleId,
        permanentDate,
        enrollmentType
      );

      for (const courseId of courseIds) {
        const course = await this.courseRepository.findCourseById(courseId);
        if (!course) {
          console.warn(
            `Course with ID ${courseId} not found, skipping enrollment`
          );
          continue;
        }

        const isEnrolled = await this.userRepository.checkCourseEnrollment(
          userId,
          courseId
        );

        if (isEnrolled) {
          await this.userRepository.updateCourseEnrollment(
            userId,
            courseId,
            bundleId,
            permanentDate
          );
        } else {
          await this.userRepository.createCourseEnrollment(
            userId,
            courseId,
            bundleId,
            permanentDate,
            enrollmentType
          );
          await this.courseRepository.updateStudentsEnrolled(courseId, userId);
        }
      }

      return await this.userRepository.findById(userId);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Permanent bundle enrollment error: ${error.message}`);
        throw error;
      }
      throw new Error("An unknown error occurred during bundle enrollment");
    }
  }
}
