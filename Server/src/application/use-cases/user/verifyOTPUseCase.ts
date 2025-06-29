import { IUserRepository } from "../../../infrastructure layer/database/repositories/userRepo";

export class VerifyOTPUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, otp: string): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      if (!user.otpExpiry || user.otp !== otp || new Date() > user.otpExpiry) {
        throw new Error("Invalid or expired OTP");
      }

      user.isVerified = true;
      user.otp = null;
      user.otpExpiry = null;
      user.isBlocked = false;
      await this.userRepository.update(user);
      return { message: "Email verified successfully" };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Verification failed");
    }
  }
}
