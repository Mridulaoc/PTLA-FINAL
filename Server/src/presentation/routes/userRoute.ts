import express, { Router } from "express";
import passport, { authenticate } from "passport";
import { UserRepository } from "../../infrastructure layer/database/repositories/userRepo";
import { BcryptService } from "../../infrastructure layer/services/bcryptService";
import { JwtService } from "../../infrastructure layer/services/jwtService";
import { UserController } from "../controllers/userController";
import { EmailService } from "../../infrastructure layer/services/emailService";
import { RegisterUserUseCase } from "../../application/use-cases/user/registerUseCase";
import { VerifyOTPUseCase } from "../../application/use-cases/user/verifyOTPUseCase";
import { ResendOTPUseCase } from "../../application/use-cases/user/resendOTPUseCase";
import { LoginUseCase } from "../../application/use-cases/user/loginUseCase";
import { GoogleAuthUseCase } from "../../application/use-cases/user/googleAuthUseCase";
import { CheckUserStatusUseCase } from "../../application/use-cases/user/checkUserStatusUseCase";
import { GetEnrollmentStatusUseCase } from "../../application/use-cases/userEnrollment/getEnrollmentStatusUseCase";
import { ChangePasswordUseCase } from "../../application/use-cases/profile/changePasswordUseCase";
import { authMiddleware } from "../../infrastructure layer/middleware/authMiddleware";
import { checkBlocked } from "../../infrastructure layer/middleware/checkBlockedMiddleware";

const userRouter = express.Router();

const userRepo = new UserRepository();
const bcryptService = new BcryptService();
const jwtService = new JwtService();
const emailService = new EmailService();

const registerUserUseCase = new RegisterUserUseCase(userRepo, bcryptService);
const verifyOTPUseCase = new VerifyOTPUseCase(userRepo);
const resendOTPUseCase = new ResendOTPUseCase(userRepo);
const loginUseCase = new LoginUseCase(userRepo, bcryptService, jwtService);
const googleAuthUseCase = new GoogleAuthUseCase(userRepo, jwtService);
const checkStatusUseCase = new CheckUserStatusUseCase(userRepo, jwtService);
const getEnrollmentStatusUseCase = new GetEnrollmentStatusUseCase(userRepo);
const changePasswordUseCase = new ChangePasswordUseCase(
  userRepo,
  bcryptService
);

const userController = new UserController(
  registerUserUseCase,
  jwtService,
  emailService,
  verifyOTPUseCase,
  resendOTPUseCase,
  loginUseCase,
  googleAuthUseCase,
  checkStatusUseCase,
  getEnrollmentStatusUseCase,
  changePasswordUseCase
);

userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
userRouter.post("/auth/google/token", userController.tokenVerification);

// User Auth Routes
userRouter.post("/register", userController.registerUser);
userRouter.post("/verify-otp", userController.verifyOTP);
userRouter.post("/resend-otp", userController.resendOTP);
userRouter.post("/login", userController.login);
userRouter.get("/check-status", userController.checkStatus);

userRouter.get(
  "/enrollment/status/:courseId",
  authMiddleware,
  checkBlocked,
  userController.getEnrollmentStatus
);

export default userRouter;
