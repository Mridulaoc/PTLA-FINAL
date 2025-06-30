import { EnrollUserUsecase } from "../../application/use-cases/enrollment/enrillUserUseCase";
import { GetAllCoursesUseCase } from "../../application/use-cases/enrollment/getAllCoursesUseCase";
import { GetUserSuggestionsUsecase } from "../../application/use-cases/enrollment/getUserSuggestionsUsecase";
import {
  AdminRepository,
  IAdminRepository,
} from "../../infrastructure layer/database/repositories/adminRepo";
import {
  CourseRepository,
  ICourseRepository,
} from "../../infrastructure layer/database/repositories/courseRepo";
import {
  IUserRepository,
  UserRepository,
} from "../../infrastructure layer/database/repositories/userRepo";
import { EnrollmentController } from "../controllers/enrollmentController";

export const enrollmentControllerFactory = (): EnrollmentController => {
  const adminRepo: IAdminRepository = new AdminRepository();
  const userRepo: IUserRepository = new UserRepository();
  const courseRepo: ICourseRepository = new CourseRepository();

  const enrollUserUsecase = new EnrollUserUsecase(
    adminRepo,
    userRepo,
    courseRepo
  );
  const getUserSuggestionsUsecase = new GetUserSuggestionsUsecase(adminRepo);
  const getAllCoursesUseCase = new GetAllCoursesUseCase(adminRepo);

  return new EnrollmentController(
    enrollUserUsecase,
    getUserSuggestionsUsecase,
    getAllCoursesUseCase
  );
};
