import { ICourse } from "../../../domain layer/entities/Course";
import { IAdminRepository } from "../../../infrastructure layer/database/repositories/adminRepo";

export class GetAllCoursesUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute(): Promise<ICourse[] | null> {
    try {
      const courses = await this.adminRepository.fetchCourses();
      return courses;
    } catch (error) {
      return null;
    }
  }
}
