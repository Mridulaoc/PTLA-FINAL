import { AddReviewUseCase } from "../../application/use-cases/review/addReviewUseCase";
import { DeleteReviewUseCase } from "../../application/use-cases/review/deleteReviewUseCase";
import { FetchCourseReviewsUseCase } from "../../application/use-cases/review/fetchCourseReviewUseCase";
import { GetAllReviewsUseCase } from "../../application/use-cases/review/getAllreviewUseCase";
import { UpdateReviewUsecase } from "../../application/use-cases/review/updateReviewUseCase";
import {
  IReviewRepository,
  ReviewRepository,
} from "../../infrastructure/database/repositories/reviewRepo";
import { ReviewController } from "../controllers/reviewController";

export const reviewControllerFactory = (): ReviewController => {
  const reviewRepo: IReviewRepository = new ReviewRepository();

  const addReviewUseCase = new AddReviewUseCase(reviewRepo);
  const fetchCourseReviewUseCase = new FetchCourseReviewsUseCase(reviewRepo);
  const updateReviewUseCase = new UpdateReviewUsecase(reviewRepo);
  const deleteReviewUseCase = new DeleteReviewUseCase(reviewRepo);
  const getAllReviewsUseCase = new GetAllReviewsUseCase(reviewRepo);

  return new ReviewController(
    addReviewUseCase,
    fetchCourseReviewUseCase,
    updateReviewUseCase,
    deleteReviewUseCase,
    getAllReviewsUseCase
  );
};
