import { ICourseBundle } from "../../../domain layer/entities/CourseBundle";
import { ICourseBundleRepository } from "../../../infrastructure layer/database/repositories/courseBundleRepo";

export class AddBundleUseCase {
  constructor(private courseBundleRepository: ICourseBundleRepository) {}

  async execute(
    bundleData: Partial<ICourseBundle>
  ): Promise<{ message: string }> {
    try {
      const result = await this.courseBundleRepository.createBundle(bundleData);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      return { message: "Could not create bundle" };
    }
  }
}
