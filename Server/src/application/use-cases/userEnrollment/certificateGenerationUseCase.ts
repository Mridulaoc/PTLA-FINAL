import { ICertificate } from "../../../domain layer/entities/Certificate";
import { ICertificateRepository } from "../../../infrastructure layer/database/repositories/certificateRepo";
import { ICourseRepository } from "../../../infrastructure layer/database/repositories/courseRepo";
import { generateCertificateNumber } from "../../../shared/utils/generateCertificateNo";

export class CertificateCreationUseCase {
  constructor(
    private certificateRepository: ICertificateRepository,
    private courseRepository: ICourseRepository
  ) {}

  async execute(
    userId: string,
    courseId: string
  ): Promise<ICertificate | null> {
    try {
      const course = await this.courseRepository.findCourseById(courseId);
      if (!course) {
        return null;
      }
      const certificateNumber = generateCertificateNumber(courseId);
      const certificate: ICertificate = {
        userId,
        courseId,
        issueDate: new Date(),
        certificateNumber,
      };
      const savedCertificate = await this.certificateRepository.create(
        certificate
      );

      return savedCertificate;
    } catch (error) {
      console.error("Error in GenerateCertificateUseCase:", error);
      throw error;
    }
  }
}
