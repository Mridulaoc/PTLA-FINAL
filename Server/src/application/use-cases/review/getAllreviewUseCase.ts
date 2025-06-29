import { IReview } from "../../../domain layer/entities/Review";
import { IReviewRepository } from "../../../infrastructure layer/database/repositories/reviewRepo";

export class GetAllReviewsUseCase {
  constructor(private reviewRepository: IReviewRepository) {}

  async execute(
    page: number,
    limit: number,
    searchTerm: string
  ): Promise<{ reviews: IReview[]; totalReviews: number }> {
    try {
      const result = await this.reviewRepository.fetchAllReviews(
        page,
        limit,
        searchTerm
      );
      if (!result) {
        throw new Error("Error fetching reviews");
      }
      return result;
    } catch (error) {
      return {
        reviews: [],
        totalReviews: 0,
      };
    }
  }
}
