import { IGoogleProfile, IUser } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/userRepo";
import { IJwtService } from "../../../infrastructure/services/jwtService";

export interface IAuthenticatedUser {
  user: IUser;
  token: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
}

export class GoogleAuthUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: IJwtService
  ) {}

  async execute(
    profile: IGoogleProfile
  ): Promise<IAuthenticatedUser | ErrorResponse> {
    try {
      const email = profile.emails ? profile.emails[0].value : "";

      let user = await this.userRepository.findByEmail(email);

      if (user?.isBlocked) {
        throw new Error(
          "Your account has been blocked. Please contact support"
        );
      }
      if (user && user.signInMethod !== "google") {
        throw new Error(
          "This email is already registered. Please use password login."
        );
      }
      if (user && user.signInMethod === "google") {
        const token = this.jwtService.generateToken({
          userId: user._id.toString(),
          email: user.email,
        });
        return { user, token };
      }

      const username = email.split("@")[0];
      const newUser = await this.userRepository.create({
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName || "",
        username: username,
        email: email,
        password: "",
        googleId: profile.id,
        signInMethod: "google",
        profileImg: profile.photos ? profile.photos[0].value : "",
        isVerified: true,
        isBlocked: false,
      });

      const token = this.jwtService.generateToken({
        userId: newUser._id.toString(),
        email: newUser.email,
      });

      return { user: newUser, token };
    } catch (error: unknown) {
      console.error("Error in findOrCreateGoogleUser:", error);

      if (error instanceof Error) {
        return {
          success: false,
          message: error.message || "An unknown error occurred",
        };
      } else {
        return {
          success: false,
          message: "An unknown error occurred",
        };
      }
    }
  }
}
