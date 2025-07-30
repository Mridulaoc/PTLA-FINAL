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
      console.log(user, "from usecase");
      if (!user) {
        console.log("no user  found");
        throw new Error("Invalid email or password");
      }
      if (user.isBlocked) {
        console.log("isblocked --", user.isBlocked);
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
      console.log("Comparing passwords");
      if (!isMatch) {
        throw new Error("Invalid password or email");
      }
      console.log("Password match result:", isMatch);

      if (!user.isVerified) {
        console.log("User is not verified");
        throw new Error("The user is not verified");
      }
      const userId: string = user._id.toString();
      console.log("Generating token and preparing response");
      const token = this.jwtService.generateToken({
        userId,
        email: user.email,
      });
      console.log("Jwt toke:", token);
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
