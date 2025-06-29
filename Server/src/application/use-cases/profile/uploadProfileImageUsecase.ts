import { IUserRepository } from "../../../infrastructure layer/database/repositories/userRepo";
import { IUploadService } from "../../../infrastructure layer/services/cloudinaryService";

export class UploadProfileImageUsease {
  constructor(
    private userRepository: IUserRepository,
    private imageUploadService: IUploadService
  ) {}

  execute = async (userId: string, filePath: string): Promise<string> => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      if (!filePath) {
        throw new Error("File path is required");
      }
      const uploadResult = await this.imageUploadService.uploadFile(filePath, {
        folder: "profile_images",
        transformation: [
          { width: 75, height: 75, crop: "limit" },
          { quality: "auto" },
        ],
        resourceType: "image",
      });
      const updatedUser = await this.userRepository.updateProfileImage(
        userId,
        uploadResult.url
      );

      return uploadResult.url;
    } catch (error) {
      return "";
    }
  };
}
