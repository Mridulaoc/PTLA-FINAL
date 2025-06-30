import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { RegisterUserUseCase } from "../../application/use-cases/user/registerUseCase";
import { IJwtService } from "../../infrastructure layer/services/jwtService";
import { IEmailService } from "../../infrastructure layer/services/emailService";
import { VerifyOTPUseCase } from "../../application/use-cases/user/verifyOTPUseCase";
import { ResendOTPUseCase } from "../../application/use-cases/user/resendOTPUseCase";
import { LoginUseCase } from "../../application/use-cases/user/loginUseCase";
import { IGoogleProfile, IUser } from "../../domain layer/entities/User";
import { GoogleAuthUseCase } from "../../application/use-cases/user/googleAuthUseCase";
import { CheckUserStatusUseCase } from "../../application/use-cases/user/checkUserStatusUseCase";
import { HttpStatus } from "../constants/HttpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";
import { ForgotPasswordUseCase } from "../../application/use-cases/user/forgotPasswordUseCase";
import { ResetpasswordUseCase } from "../../application/use-cases/user/resetPasswordUseCase";

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

export class UserController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private jwtService: IJwtService,
    private emailService: IEmailService,
    private verifyOTPUseCase: VerifyOTPUseCase,
    private resendOTPUseCase: ResendOTPUseCase,
    private loginUseCase: LoginUseCase,
    private googleAuthUsecase: GoogleAuthUseCase,
    private checkUserStatusUseCase: CheckUserStatusUseCase,
    private forgotPasswordUseCase: ForgotPasswordUseCase,
    private resetPasswordUseCase: ResetpasswordUseCase
  ) {}
  registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const newUser = await this.registerUserUseCase.execute(req.body);
      if (newUser) {
        const token = this.jwtService.generateToken(newUser);
        if (newUser.otp)
          await this.emailService.sendOTPEmail(newUser.email, newUser.otp);

        res.status(HttpStatus.CREATED).json({
          message: ResponseMessages.USER_REGISTERED,
          userId: newUser._id,
          token,
        });
      }
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  };

  verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, otp } = req.body;
      const result = await this.verifyOTPUseCase.execute(userId, otp);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;

        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
      }
    }
  };

  resendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.body;

      const user = await this.resendOTPUseCase.execute(userId);
      if (user) {
        if (user.otp)
          await this.emailService.sendOTPEmail(user.email, user.otp);
        res
          .status(HttpStatus.OK)
          .json({ message: ResponseMessages.OTP_RESENT });
      }
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.loginUseCase.execute(email, password);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "The user is not verified") {
          res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
        } else {
          res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "An unknown error occurred" });
      }
    }
  };

  tokenVerification = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;
      if (!token) {
        throw new Error("Token is required");
        return;
      }
      req.headers.authorization = `Bearer ${token}`;
      await this.googleAuth(req, res);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: ResponseMessages.FAILED_TO_VERIFY_GOOGLE_TOKEN,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  googleAuth = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.body.token || req.headers.authorization?.split(" ")[1];

      if (!token) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: ResponseMessages.GOOGLE_TOKEN_REQUIRED });
        return;
      }

      try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
          res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ message: ResponseMessages.INVALID_TOKEN_PAYLOAD });
          return;
        }

        const profile: IGoogleProfile = {
          emails: [{ value: payload.email }],
          name: {
            givenName: payload.given_name || "",
            familyName: payload.family_name || "",
          },
          id: payload.sub,
          photos: payload.picture ? [{ value: payload.picture }] : [],
        };
        const result = await this.googleAuthUsecase.execute(profile);
        if ("success" in result && !result.success) {
          res.status(HttpStatus.BAD_REQUEST).json({ message: result.message });
          return;
        }
        res.status(HttpStatus.OK).json(result);
      } catch (verifyError) {
        res.status(401).json({
          message: ResponseMessages.FAILED_TO_VERIFY_GOOGLE_TOKEN,
          error:
            verifyError instanceof Error
              ? verifyError.message
              : "Unknown error",
        });
      }
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "Failed to authenticate with Google." });
    }
  };

  checkStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: ResponseMessages.UNAUTHORIZED });
        return;
      }
      const result = await this.checkUserStatusUseCase.execute(token);

      res.json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      const user = await this.forgotPasswordUseCase.execute(email);
      if (user && user.otp)
        await this.emailService.sendOTPEmail(user.email, user.otp);
      res.status(200).json({
        messsage: "OTP sent successfully",
        userId: user ? user._id : null,
      });
    } catch (error: unknown) {
      if (error instanceof Error)
        res.status(400).json({ message: error.message, status: "error" });
    }
  };

  verifyResetPasswordOTP = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userId, otp } = req.body;
      await this.verifyOTPUseCase.execute(userId, otp);
      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;

        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, password } = req.body;
      await this.resetPasswordUseCase.execute(userId, password);
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
