import { Request, Response } from "express";
import fs from "fs";
import { GetUserUseCase } from "../../application/use-cases/profile/getUserUseCase";
import { UpdateUserProfileUseCase } from "../../application/use-cases/profile/updateProfileUseCase";
import { UploadProfileImageUsease } from "../../application/use-cases/profile/uploadProfileImageUsecase";
import { ChangePasswordUseCase } from "../../application/use-cases/profile/changePasswordUseCase";
import { IUser } from "../../domain layer/entities/User";
import { HttpStatus } from "../constants/HttpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";

export class ProfileController {
  constructor(
    private getUserUseCase: GetUserUseCase,
    private updateUserProfileUseCase: UpdateUserProfileUseCase,
    private uploadProfileImageUseCase: UploadProfileImageUsease,
    private changePasswordUseCase: ChangePasswordUseCase
  ) {}
  getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user || !user._id) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: ResponseMessages.UNAUTHORIZED });
        return;
      }
      const existingUser = await this.getUserUseCase.execute(
        user._id.toString()
      );
      if (!existingUser) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: ResponseMessages.USER_NOT_FOUND });
        return;
      }

      res.json(existingUser);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
    }
  };

  updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;

      if (!user || !user._id) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: ResponseMessages.UNAUTHORIZED });
        return;
      }
      const userId = user._id.toString();
      const updateData = req.body;

      const existingUser = await this.updateUserProfileUseCase.execute(
        userId,
        updateData
      );
      res.json(existingUser);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
    }
  };

  uploadProfileImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;

      if (!user || !user._id) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: ResponseMessages.UNAUTHORIZED });
        return;
      }

      if (!req.file) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: ResponseMessages.NO_FILE_UPLOADED });
        return;
      }

      const profileImageUrl = await this.uploadProfileImageUseCase.execute(
        user._id.toString(),
        req.file.path
      );
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });

      res.status(HttpStatus.OK).json({
        message: ResponseMessages.PROFILE_IMAGE_UPLOAD_SUCCESS,
        profileImageUrl,
      });
    } catch (error) {
      console.error("Profile image upload error:", error);

      if (error instanceof Error) {
        res.status(500).json({
          message:
            error.message || ResponseMessages.PROFILE_IMAGE_UPLOAD_FAILED,
        });
      }
    }
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      const userId = user._id.toString();

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: ResponseMessages.UNAUTHORIZED,
        });
        return;
      }
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ResponseMessages.OLD_NEW_PASSWORD_REQUIRED,
        });
        return;
      }

      const result = await this.changePasswordUseCase.execute({
        userId,
        oldPassword,
        newPassword,
      });
      if (!result.success) {
        res.status(HttpStatus.BAD_REQUEST).json(result);
        return;
      }
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : ResponseMessages.CHANGE_PASSWORD_ERROR;

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseMessages.CHANGE_PASSWORD_ERROR,
      });
    }
  };
}
