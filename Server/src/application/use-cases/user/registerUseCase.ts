import { IUser } from "../../../domain layer/entities/User";
import { IUserRepository } from "../../../infrastructure layer/database/repositories/userRepo";
import { IBcryptService } from "../../../infrastructure layer/services/bcryptService";
import { generateOTP } from "../../../shared/utils/generateOtp";

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private bcryptService: IBcryptService
  ) {}

  async execute(
    user: Omit<IUser, "isVerified" | "otp" | "otpExpiry" | "isBlocked">
  ): Promise<IUser | null> {
    try {
      const existingUser = await this.userRepository.findByEmail(user.email);
      if (existingUser) {
        throw new Error("Email is already registered");
      }

      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);
      if (!user.password) {
        throw new Error("Password is required");
      }

      const hashedPassword = await this.bcryptService.hashPassword(
        user.password
      );
      const newUser = await this.userRepository.create({
        ...user,
        password: hashedPassword,
        isVerified: false,
        isBlocked: false,
        otp,
        otpExpiry,
      });
      if (!newUser) {
        throw new Error("Could not create new user");
      }
      return newUser;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      return null;
    }
  }
}
