import { AddLessonsUseCase } from "../../application/use-cases/lesson/addLessonUseCase";
import { DeleteLessonUseCase } from "../../application/use-cases/lesson/deleteLessonUseCase";
import { FetchLessonsUseCase } from "../../application/use-cases/lesson/fetchLessonsUseCase";
import { UpdateLessonUseCase } from "../../application/use-cases/lesson/updateLessonUsecase";
import {
  ILessonRepository,
  LessonRepository,
} from "../../infrastructure layer/database/repositories/lessonRepo";
import { LessonController } from "../controllers/lessonController";

export const lessoControllerFactory = (): LessonController => {
  const lessonRepo: ILessonRepository = new LessonRepository();

  const addLessonsUseCase = new AddLessonsUseCase(lessonRepo);
  const fetchLessonsUseCase = new FetchLessonsUseCase(lessonRepo);
  const updateLessonUseCase = new UpdateLessonUseCase(lessonRepo);
  const deleteLessonUseCase = new DeleteLessonUseCase(lessonRepo);

  return new LessonController(
    addLessonsUseCase,
    fetchLessonsUseCase,
    updateLessonUseCase,
    deleteLessonUseCase
  );
};
