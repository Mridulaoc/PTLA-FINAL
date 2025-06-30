import { IUserRepository } from "../../../infrastructure/database/repositories/userRepo";
import { IBcryptService } from "../../../infrastructure/services/bcryptService";

export interface IChangePasswordInputs {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export interface IChangePasswordResponse {
  success: boolean;
  message: string;
}

export class ChangePasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private bcryptService: IBcryptService
  ) {}

  async execute(data: IChangePasswordInputs): Promise<IChangePasswordResponse> {
    try {
      if (data.oldPassword === data.newPassword) {
        return {
          success: false,
          message: "New password must be different from the current password",
        };
      }
      const user = await this.userRepository.findById(data.userId);
      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = await this.bcryptService.comparePasswords(
        user.password as string,
        data.oldPassword
      );

      if (!isPasswordValid) {
        return {
          success: false,
          message: "Current password is incorrect",
        };
      }

      const hashedNewPassword = await this.bcryptService.hashPassword(
        data.newPassword
      );
      await this.userRepository.updatePassword(data.userId, hashedNewPassword);

      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to change password",
      };
    }
  }
}
