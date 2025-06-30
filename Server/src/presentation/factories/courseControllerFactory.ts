import { AddCourseUseCase } from "../../application/use-cases/course/addNewCourseUseCase";
import { DeleteCourseUsecase } from "../../application/use-cases/course/deleteCourseUseCase";
import { FetchCourseDetailsUseCase } from "../../application/use-cases/course/fetchCourseDetailsUsecase";
import { FetchCoursesUseCase } from "../../application/use-cases/course/fetchCoursesUseCase";
import { GetPopularCoursesUseCase } from "../../application/use-cases/course/getPopularCoursesUseCase";
import { GetPublicCoursesUsecase } from "../../application/use-cases/course/getPublicCoursesUsecase";
import { UpdateCourseDetailsUseCase } from "../../application/use-cases/course/updateCourseDetailsUseCase";
import { UploadFeaturedImageUsecase } from "../../application/use-cases/course/uploadFeaturedImageUseCase";
import { UploadIntroVideoUsecase } from "../../application/use-cases/course/uploadIntroVideoUseCase";
import {
  CourseRepository,
  ICourseRepository,
} from "../../infrastructure/database/repositories/courseRepo";
import {
  CloudinaryUploadService,
  IUploadService,
} from "../../infrastructure/services/cloudinaryService";
import { CourseController } from "../controllers/courseController";

export const courseControllerFactory = (): CourseController => {
  const courseRepo: ICourseRepository = new CourseRepository();

  const fileUploadService: IUploadService = new CloudinaryUploadService();

  const addCourseUseCase = new AddCourseUseCase(courseRepo);
  const uploadFeaturedImageUseCase = new UploadFeaturedImageUsecase(
    fileUploadService
  );
  const uploadIntroVideoUseCase = new UploadIntroVideoUsecase(
    fileUploadService
  );
  const fetchCoursesUseCase = new FetchCoursesUseCase(courseRepo);
  const getPublicCoursesUsecase = new GetPublicCoursesUsecase(courseRepo);
  const fetchCourseDetailsUsecase = new FetchCourseDetailsUseCase(courseRepo);
  const updateCourseDetailsUseCase = new UpdateCourseDetailsUseCase(courseRepo);
  const deleteCourseUseCase = new DeleteCourseUsecase(courseRepo);
  const getPopularCoursesUseCase = new GetPopularCoursesUseCase(courseRepo);

  return new CourseController(
    addCourseUseCase,
    uploadFeaturedImageUseCase,
    uploadIntroVideoUseCase,
    fetchCoursesUseCase,
    getPublicCoursesUsecase,
    fetchCourseDetailsUsecase,
    updateCourseDetailsUseCase,
    deleteCourseUseCase,
    getPopularCoursesUseCase
  );
};
