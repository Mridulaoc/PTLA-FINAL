import { IUserRepository } from "../../../infrastructure/database/repositories/userRepo";
import { IBcryptService } from "../../../infrastructure/services/bcryptService";
import { IJwtService } from "../../../infrastructure/services/jwtService";

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private bcryptService: IBcryptService,
    private jwtService: IJwtService
  ) {}

  async execute(
    email: string,
    password: string
  ): Promise<{ message: string; userId: string; token: string }> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error("Invalid email or password");
      }
      if (user.isBlocked) {
        throw new Error(
          "Your account has been blocked. Please contact support"
        );
      }

      if (!user.password) {
        throw new Error("Invalid email or password");
      }

      const isMatch = await this.bcryptService.comparePasswords(
        password,
        user.password
      );
      if (!isMatch) {
        throw new Error("Invalid password or email");
      }

      if (!user.isVerified) throw new Error("The user is not verified");

      const userId: string = user._id.toString();

      const token = this.jwtService.generateToken(user);

      return { message: "Login successful", userId, token };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }
}
