import { CheckUserStatusUseCase } from "../../application/use-cases/user/checkUserStatusUseCase";
import { ForgotPasswordUseCase } from "../../application/use-cases/user/forgotPasswordUseCase";
import { GoogleAuthUseCase } from "../../application/use-cases/user/googleAuthUseCase";
import { LoginUseCase } from "../../application/use-cases/user/loginUseCase";
import { RegisterUserUseCase } from "../../application/use-cases/user/registerUseCase";
import { ResendOTPUseCase } from "../../application/use-cases/user/resendOTPUseCase";
import { ResetpasswordUseCase } from "../../application/use-cases/user/resetPasswordUseCase";
import { VerifyOTPUseCase } from "../../application/use-cases/user/verifyOTPUseCase";
import {
  IUserRepository,
  UserRepository,
} from "../../infrastructure/database/repositories/userRepo";
import {
  BcryptService,
  IBcryptService,
} from "../../infrastructure/services/bcryptService";
import {
  EmailService,
  IEmailService,
} from "../../infrastructure/services/emailService";
import {
  IJwtService,
  JwtService,
} from "../../infrastructure/services/jwtService";
import { UserController } from "../controllers/userController";

export const userControllerFactory = (): UserController => {
  const userRepo: IUserRepository = new UserRepository();

  const bcryptService: IBcryptService = new BcryptService();
  const jwtService: IJwtService = new JwtService();
  const emailService: IEmailService = new EmailService();

  const registerUseCase = new RegisterUserUseCase(userRepo, bcryptService);
  const verifyOTPUseCase = new VerifyOTPUseCase(userRepo);
  const resendOTPUseCase = new ResendOTPUseCase(userRepo);
  const loginUseCase = new LoginUseCase(userRepo, bcryptService, jwtService);
  const googleAuthUseCase = new GoogleAuthUseCase(userRepo, jwtService);
  const checkUserStatusUseCase = new CheckUserStatusUseCase(
    userRepo,
    jwtService
  );
  const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepo);
  const resetPasswordUseCase = new ResetpasswordUseCase(
    userRepo,
    bcryptService
  );

  return new UserController(
    registerUseCase,
    jwtService,
    emailService,
    verifyOTPUseCase,
    resendOTPUseCase,
    loginUseCase,
    googleAuthUseCase,
    checkUserStatusUseCase,
    forgotPasswordUseCase,
    resetPasswordUseCase
  );
};
