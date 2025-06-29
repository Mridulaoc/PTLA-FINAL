import { IUserRepository } from "../../../infrastructure layer/database/repositories/userRepo";
import { IBcryptService } from "../../../infrastructure layer/services/bcryptService";

export class ResetpasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private bcryptService: IBcryptService
  ) {}
  async execute(userId: string, newPassword: string): Promise<void> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      if (!user.isVerified) {
        throw new Error("Please verify your OTP first");
      }

      const hashedPassword = await this.bcryptService.hashPassword(newPassword);
      user.password = hashedPassword;

      await this.userRepository.update(user);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }
}
