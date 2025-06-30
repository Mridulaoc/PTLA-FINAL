import { AddBundleUseCase } from "../../application/use-cases/courseBundle/addBundleUseCase";
import { DeleteBundleUseCase } from "../../application/use-cases/courseBundle/deleteBundleUseCase";
import { FetchAllCoursesUseCase } from "../../application/use-cases/courseBundle/fetchAllCoursesUseCase";
import { FetchBundleDetailsUseCase } from "../../application/use-cases/courseBundle/fetchBundleDetailsUseCase";
import { FetchBundlesUseCase } from "../../application/use-cases/courseBundle/fetchBundlesUseCase";
import { UpdateBundleUseCase } from "../../application/use-cases/courseBundle/updateBundleUseCase";
import {
  CourseBundleRepository,
  ICourseBundleRepository,
} from "../../infrastructure/database/repositories/courseBundleRepo";
import { CourseBundleController } from "../controllers/courseBundleController";

export const courseBundleFactory = (): CourseBundleController => {
  const courseBundleRepo: ICourseBundleRepository =
    new CourseBundleRepository();

  const fetchAllCoursesUseCase = new FetchAllCoursesUseCase(courseBundleRepo);
  const addBundleUseCase = new AddBundleUseCase(courseBundleRepo);
  const fetchBundlesUseCase = new FetchBundlesUseCase(courseBundleRepo);
  const deleteBundleUseCase = new DeleteBundleUseCase(courseBundleRepo);
  const fetchBundleDetailsUseCase = new FetchBundleDetailsUseCase(
    courseBundleRepo
  );
  const updateBundleUseCase = new UpdateBundleUseCase(courseBundleRepo);

  return new CourseBundleController(
    fetchAllCoursesUseCase,
    addBundleUseCase,
    fetchBundlesUseCase,
    deleteBundleUseCase,
    fetchBundleDetailsUseCase,
    updateBundleUseCase
  );
};
