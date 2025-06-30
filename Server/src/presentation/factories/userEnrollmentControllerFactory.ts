import { CertificateCreationUseCase } from "../../application/use-cases/userEnrollment/certificateGenerationUseCase";
import { FetchLessonProgressUseCase } from "../../application/use-cases/userEnrollment/fetchLessonProgressUseCase";
import { GetEnrollmentStatusUseCase } from "../../application/use-cases/userEnrollment/getEnrollmentStatusUseCase";
import { UpdateLessonProgressUseCase } from "../../application/use-cases/userEnrollment/updateLessonProgressUseCase";
import {
  CertificateRepository,
  ICertificateRepository,
} from "../../infrastructure layer/database/repositories/certificateRepo";
import {
  CourseRepository,
  ICourseRepository,
} from "../../infrastructure layer/database/repositories/courseRepo";
import {
  ILessonProgressRepository,
  LessonProgressRepository,
} from "../../infrastructure layer/database/repositories/lessonProgressRepo";
import {
  IUserRepository,
  UserRepository,
} from "../../infrastructure layer/database/repositories/userRepo";
import { UserEnrollmentController } from "../controllers/userEnrollmentController";

export const userEnrollmentControllerfactory = (): UserEnrollmentController => {
  const userRepo: IUserRepository = new UserRepository();
  const lessonProgressRepo: ILessonProgressRepository =
    new LessonProgressRepository();
  const certificateRepo: ICertificateRepository = new CertificateRepository();
  const courseRepo: ICourseRepository = new CourseRepository();

  const getEnrollmentStatusUseCase = new GetEnrollmentStatusUseCase(userRepo);
  const updateLessonProgressUseCase = new UpdateLessonProgressUseCase(
    lessonProgressRepo
  );
  const fetchLessonProgressUseCase = new FetchLessonProgressUseCase(
    lessonProgressRepo
  );
  const certificateCreationUseCase = new CertificateCreationUseCase(
    certificateRepo,
    courseRepo
  );

  return new UserEnrollmentController(
    getEnrollmentStatusUseCase,
    updateLessonProgressUseCase,
    fetchLessonProgressUseCase,
    certificateCreationUseCase
  );
};
