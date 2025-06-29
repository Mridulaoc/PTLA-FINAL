import { Request, Response } from "express";
import { AddLessonsUseCase } from "../../application/use-cases/lesson/addLessonUseCase";
import { FetchLessonsUseCase } from "../../application/use-cases/lesson/fetchLessonsUseCase";
import { UpdateLessonUseCase } from "../../application/use-cases/lesson/updateLessonUsecase";
import { DeleteLessonUseCase } from "../../application/use-cases/lesson/deleteLessonUseCase";
import { HttpStatus } from "../constants/HttpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";

export class LessonController {
  constructor(
    private addLessonsUseCase: AddLessonsUseCase,
    private fetchLessonsUseCase: FetchLessonsUseCase,
    private updateLessonUseCase: UpdateLessonUseCase,
    private deleteLessonUseCase: DeleteLessonUseCase
  ) {}

  addLesssons = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId } = req.params;
      const { lessons } = req.body;
      if (!courseId || !lessons || !Array.isArray(lessons)) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ResponseMessages.INVALID_REQUEST,
        });
        return;
      }

      for (const lesson of lessons) {
        if (!lesson.title || !lesson.description) {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: ResponseMessages.MISSING_LESSON_FIELDS,
          });
          return;
        }
      }

      const result = await this.addLessonsUseCase.execute(courseId, lessons);
      res
        .status(HttpStatus.CREATED)
        .json({ message: ResponseMessages.LESSONS_ADDED });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.LESSON_ADD_FAILED });
    }
  };

  getAllLessons = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const { lessons, total } = await this.fetchLessonsUseCase.execute(
        courseId,
        page,
        limit
      );
      res.status(HttpStatus.OK).json({ lessons, total, page, limit });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.LESSON_FETCH_FAILED });
    }
  };

  updateLesson = async (req: Request, res: Response): Promise<void> => {
    try {
      const { lessonId } = req.params;
      const lessonData = req.body;
      const updatedLesson = await this.updateLessonUseCase.execute(
        lessonId,
        lessonData
      );

      if (!updatedLesson) {
        throw new Error("Error updating lesson");
      }
      res.status(HttpStatus.OK).json({
        lesson: updatedLesson,
        message: ResponseMessages.LESSON_UPDATED,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.LESSON_UPDATE_FAILED,
      });
    }
  };

  deleteLesson = async (req: Request, res: Response): Promise<void> => {
    try {
      const lessonId = req.params.lessonId;
      const result = await this.deleteLessonUseCase.execute(lessonId);
      if (!result.success) {
        res.status(HttpStatus.NOT_FOUND).json({ message: result.message });
        return;
      }
      res.status(HttpStatus.OK).json({ messsage: result.message });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.LESSON_DELETE_FAILED,
      });
    }
  };
}
