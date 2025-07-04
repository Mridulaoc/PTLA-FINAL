import { IReview } from "../../../domain/entities/Review";
import { IReviewRepository } from "../../../infrastructure/database/repositories/reviewRepo";

export class UpdateReviewUsecase {
  constructor(private reviewRepository: IReviewRepository) {}

  async execute(
    reviewId: string,
    reviewData: Partial<IReview>
  ): Promise<IReview | null> {
    try {
      const updatedReview = await this.reviewRepository.updateReview(
        reviewId,
        reviewData
      );
      if (!updatedReview) {
        throw new Error("Review not found");
      }
      return updatedReview;
    } catch (error) {
      throw new Error(`Failed to update review`);
    }
  }
}
