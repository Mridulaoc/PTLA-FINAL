import { ILessonProgress } from "../../../domain layer/entities/LessonProgress";
import { ILessonProgressRepository } from "../../../infrastructure layer/database/repositories/lessonProgressRepo";

export class FetchLessonProgressUseCase {
  constructor(private lessonProgressRepository: ILessonProgressRepository) {}

  async execute(
    userId: string,
    courseId: string
  ): Promise<ILessonProgress[] | null> {
    try {
      const progress = await this.lessonProgressRepository.fetchLessonProgress(
        courseId,
        userId
      );

      return progress;
    } catch (error) {
      throw new Error("Failed to fetch lesson progress");
    }
  }
}
