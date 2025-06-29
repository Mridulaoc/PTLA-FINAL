import { IUser } from "../../../domain layer/entities/User";
import { IUserRepository } from "../../../infrastructure layer/database/repositories/userRepo";
import { generateOTP } from "../../../shared/utils/generateOtp";

export class ResendOTPUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<IUser | null> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      const otp: string = generateOTP();
      const otpExpiry: Date = new Date(Date.now() + 1 * 60 * 1000);

      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await this.userRepository.update(user);

      const updatedUser = await this.userRepository.findById(userId);
      if (!updatedUser) {
        throw new Error("Not able to update user");
      }
      return updatedUser;
    } catch (error) {
      return null;
    }
  }
}
