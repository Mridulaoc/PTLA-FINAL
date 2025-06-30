import { ICourseBundle } from "../../../domain/entities/CourseBundle";
import { ICourseBundleRepository } from "../../../infrastructure/database/repositories/courseBundleRepo";

export class FetchBundleDetailsUseCase {
  constructor(private courseBundleRepository: ICourseBundleRepository) {}
  async execute(bundleId: string): Promise<ICourseBundle | null> {
    try {
      const bundle = await this.courseBundleRepository.findBundleById(bundleId);
      if (!bundle) {
        throw new Error("Bundle not found");
      }
      return bundle;
    } catch (error) {
      return null;
    }
  }
}
