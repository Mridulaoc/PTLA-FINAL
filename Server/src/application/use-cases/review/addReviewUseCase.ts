import { IReview } from "../../../domain layer/entities/Review";
import { IReviewRepository } from "../../../infrastructure layer/database/repositories/reviewRepo";

export class AddReviewUseCase {
  constructor(private reviewRepository: IReviewRepository) {}
  async execute(review: IReview): Promise<IReview> {
    try {
      const existingReview = await this.reviewRepository.findByUserAndCourse(
        review.courseId.toString(),
        review.userId.toString()
      );
      if (existingReview) {
        throw new Error("You have already reviewed this course.");
      }

      return await this.reviewRepository.addReview(review);
    } catch (error) {
      throw new Error("UseCase Error: Failed to add review ");
    }
  }
}
