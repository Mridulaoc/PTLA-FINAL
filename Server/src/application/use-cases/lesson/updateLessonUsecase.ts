import { ILesson } from "../../../domain/entities/lesson";
import { ILessonRepository } from "../../../infrastructure/database/repositories/lessonRepo";

export class UpdateLessonUseCase {
  constructor(private lessonRepository: ILessonRepository) {}
  async execute(
    lessonId: string,
    lessonData: Partial<ILesson>
  ): Promise<ILesson | null> {
    try {
      if (!lessonId) {
        throw new Error("Lesson ID is required");
      }
      const existingLesson = await this.lessonRepository.findById(lessonId);
      if (!existingLesson) {
        throw new Error("Lesson not found");
      }
      if (!lessonData.title || !lessonData.videoUrl) {
        throw new Error("Title and video URL are required");
      }

      const updatedLesson = await this.lessonRepository.updateLesson(
        lessonId,
        lessonData
      );
      if (!updatedLesson) {
        throw new Error("Failed to update lesson");
      }
      return updatedLesson;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Something went wrong"
      );
      return null;
    }
  }
}
