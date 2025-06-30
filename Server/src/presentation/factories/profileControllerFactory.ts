import { ChangePasswordUseCase } from "../../application/use-cases/profile/changePasswordUseCase";
import { GetUserUseCase } from "../../application/use-cases/profile/getUserUseCase";
import { UpdateUserProfileUseCase } from "../../application/use-cases/profile/updateProfileUseCase";
import { UploadProfileImageUsease } from "../../application/use-cases/profile/uploadProfileImageUsecase";
import {
  IUserRepository,
  UserRepository,
} from "../../infrastructure/database/repositories/userRepo";
import {
  BcryptService,
  IBcryptService,
} from "../../infrastructure/services/bcryptService";
import {
  CloudinaryUploadService,
  IUploadService,
} from "../../infrastructure/services/cloudinaryService";
import { ProfileController } from "../controllers/profileController";

export const profileControllerFactory = (): ProfileController => {
  const userRepo: IUserRepository = new UserRepository();

  const imageUploadService: IUploadService = new CloudinaryUploadService();
  const bcryptService: IBcryptService = new BcryptService();

  const getUserUseCase = new GetUserUseCase(userRepo);
  const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepo);
  const uploadProfileImageUseCase = new UploadProfileImageUsease(
    userRepo,
    imageUploadService
  );
  const changePasswordUseCase = new ChangePasswordUseCase(
    userRepo,
    bcryptService
  );

  return new ProfileController(
    getUserUseCase,
    updateUserProfileUseCase,
    uploadProfileImageUseCase,
    changePasswordUseCase
  );
};
