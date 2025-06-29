import { Request, Response } from "express";
import { AddReviewUseCase } from "../../application/use-cases/review/addReviewUseCase";
import { FetchCourseReviewsUseCase } from "../../application/use-cases/review/fetchCourseReviewUseCase";
import { UpdateReviewUsecase } from "../../application/use-cases/review/updateReviewUseCase";
import { DeleteReviewUseCase } from "../../application/use-cases/review/deleteReviewUseCase";
import { GetAllReviewsUseCase } from "../../application/use-cases/review/getAllreviewUseCase";
import { IUser } from "../../domain layer/entities/User";
import { ReviewModel } from "../../infrastructure layer/database/models/reviewModel";
import { ResponseMessages } from "../constants/ResponseMessages";
import { HttpStatus } from "../constants/HttpStatus";

export class ReviewController {
  constructor(
    private addReviewUseCase: AddReviewUseCase,
    private fetchCourseReviewUseCase: FetchCourseReviewsUseCase,
    private updateReviewUseCase: UpdateReviewUsecase,
    private deleteReviewUseCase: DeleteReviewUseCase,
    private getAllReviewsUseCase: GetAllReviewsUseCase
  ) {}

  addReview = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId } = req.params;
      const { rating, title, reviewText } = req.body;

      const user = req.user as IUser;
      if (!user || !user._id) {
        throw new Error(ResponseMessages.USER_NOT_FOUND);
      }
      const userId = user._id.toString();
      const review = await this.addReviewUseCase.execute({
        courseId,
        userId,
        rating,
        title,
        reviewText,
      });

      res
        .status(HttpStatus.CREATED)
        .json({ message: ResponseMessages.REVIEW_ADDED_SUCCESS });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: ResponseMessages.REVIEW_ADD_FAILED,
      });
    }
  };

  fetchCourseReviews = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const { courseId } = req.params;

      if (!courseId) {
        throw new Error(ResponseMessages.COURSE_ID_REQUIRED);
      }
      const { reviews, total } = await this.fetchCourseReviewUseCase.execute(
        courseId,
        page,
        limit
      );

      res.status(HttpStatus.OK).json({ reviews, total });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.INTERNAL_SERVER_ERROR,
      });
    }
  };

  updateReview = async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const reviewData = req.body;

    try {
      const updatedReview = await this.updateReviewUseCase.execute(
        reviewId,
        reviewData
      );
      res.status(HttpStatus.OK).json({
        message: ResponseMessages.REVIEW_UPDATE_SUCCESS,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: ResponseMessages.REVIEW_UPDATE_FAILED,
      });
    }
  };

  deleteReview = async (req: Request, res: Response) => {
    const { reviewId } = req.params;

    try {
      await this.deleteReviewUseCase.execute(reviewId);
      res.status(HttpStatus.OK).json({
        message: ResponseMessages.REVIEW_DELETE_SUCCESS,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: ResponseMessages.REVIEW_DELETE_FAILED,
      });
    }
  };

  getAllReviews = async (req: Request, res: Response): Promise<void> => {
    try {
      let page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { searchTerm } = req.query;

      const { totalReviews, reviews } = await this.getAllReviewsUseCase.execute(
        page,
        limit,
        searchTerm as string
      );

      res.status(HttpStatus.OK).json({ reviews, totalReviews, page, limit });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.REVIEW_FETCH_ERROR });
    }
  };
}
