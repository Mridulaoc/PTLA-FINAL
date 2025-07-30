import { IAdminRepository } from "../../../infrastructure/database/repositories/adminRepo";
import { IBcryptService } from "../../../infrastructure/services/bcryptService";
import { IJwtService } from "../../../infrastructure/services/jwtService";

export class AdminLoginUseCase {
  constructor(
    private adminRepository: IAdminRepository,
    private bcryptService: IBcryptService,
    private jwtService: IJwtService
  ) {}

  async execute(
    email: string,
    password: string
  ): Promise<{ message: string; adminId: string; token: string }> {
    try {
      const admin = await this.adminRepository.findByEmail(email);

      if (!admin) {
        throw new Error("Invalid credentials");
      }

      const isValidPassword = await this.bcryptService.comparePasswords(
        password,
        admin.password
      );

      if (!isValidPassword) {
        throw new Error("Invalid credentials");
      }
      const adminId: string = admin._id.toString();
      const token = this.jwtService.generateToken({
        adminId,
        email: admin.email,
      });

      return { message: "Login successful", adminId, token };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }
}
