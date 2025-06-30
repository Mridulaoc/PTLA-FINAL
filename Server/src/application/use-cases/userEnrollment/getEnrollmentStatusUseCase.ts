import { IUserRepository } from "../../../infrastructure/database/repositories/userRepo";

export class GetEnrollmentStatusUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    userId: string,
    courseId: string
  ): Promise<{ isEnrolled: boolean }> {
    try {
      const result = await this.userRepository.isUserEnrolled(userId, courseId);
      return result;
    } catch (error) {
      console.error("Error in GetEnrollmentStatusUseCase:", error);
      return { isEnrolled: false };
    }
  }
}
