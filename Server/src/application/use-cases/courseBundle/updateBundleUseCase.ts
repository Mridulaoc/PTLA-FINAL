import { ICourseBundle } from "../../../domain layer/entities/CourseBundle";
import { ICourseBundleRepository } from "../../../infrastructure layer/database/repositories/courseBundleRepo";

export class UpdateBundleUseCase {
  constructor(private courseBundleRepository: ICourseBundleRepository) {}

  async execute(
    bundleId: string,
    bundleData: Partial<ICourseBundle>
  ): Promise<ICourseBundle | null> {
    try {
      const existingBundle = await this.courseBundleRepository.findBundleById(
        bundleId
      );

      if (!existingBundle) {
        throw new Error("Bundle not found");
      }

      const updatedBundle = await this.courseBundleRepository.updateBundle(
        bundleData,
        bundleId
      );
      return updatedBundle;
    } catch (error) {
      return null;
    }
  }
}
