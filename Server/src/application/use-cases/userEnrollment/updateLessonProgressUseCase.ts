import { ILessonProgress } from "../../../domain layer/entities/LessonProgress";
import { ILessonProgressRepository } from "../../../infrastructure layer/database/repositories/lessonProgressRepo";

export class UpdateLessonProgressUseCase {
  constructor(private lessonProgressRepository: ILessonProgressRepository) {}

  async execute(
    userId: string,
    courseId: string,
    lessonId: string,
    isCompleted: boolean,
    playbackPosition: number
  ): Promise<ILessonProgress | null> {
    try {
      const updatedProgress =
        await this.lessonProgressRepository.updateLessonProgress(
          userId,
          courseId,
          lessonId,
          isCompleted,
          playbackPosition
        );

      if (!updatedProgress) {
        throw new Error("Lesson progress not found");
      }

      return updatedProgress;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Couldnot update Lesson"
      );
    }
  }
}
