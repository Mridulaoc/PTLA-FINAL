import { IReview } from "../../../domain layer/entities/Review";
import { IReviewRepository } from "../../../infrastructure layer/database/repositories/reviewRepo";

export class FetchCourseReviewsUseCase {
  constructor(private reviewRepository: IReviewRepository) {}
  async execute(
    courseId: string,
    page: number,
    limit: number
  ): Promise<{ reviews: IReview[]; total: number }> {
    try {
      const result = await this.reviewRepository.fetchCourseReviews(
        courseId,
        page,
        limit
      );
      return result;
    } catch (error) {
      throw new Error("Could not fetch reviews");
    }
  }
}
