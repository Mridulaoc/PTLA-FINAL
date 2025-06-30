import { Request, Response } from "express";
import { GetEnrollmentStatusUseCase } from "../../application/use-cases/userEnrollment/getEnrollmentStatusUseCase";
import { IUser } from "../../domain layer/entities/User";
import { ResponseMessages } from "../constants/ResponseMessages";
import { HttpStatus } from "../constants/HttpStatus";
import { UpdateLessonProgressUseCase } from "../../application/use-cases/userEnrollment/updateLessonProgressUseCase";
import { FetchLessonProgressUseCase } from "../../application/use-cases/userEnrollment/fetchLessonProgressUseCase";
import { CertificateCreationUseCase } from "../../application/use-cases/userEnrollment/certificateGenerationUseCase";

export class UserEnrollmentController {
  constructor(
    private getEnrollmentStatusUseCase: GetEnrollmentStatusUseCase,
    private updateLessonProgressUseCase: UpdateLessonProgressUseCase,
    private fetchLessonProgressUseCase: FetchLessonProgressUseCase,
    private certificateCreationUseCase: CertificateCreationUseCase
  ) {}

  getEnrollmentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId } = req.params;
      const user = req.user as IUser;
      if (!user || !user._id) {
        throw new Error(ResponseMessages.USER_NOT_FOUND);
      }
      const userId = user._id.toString();
      const result = await this.getEnrollmentStatusUseCase.execute(
        userId,
        courseId
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: error.message || ResponseMessages.INTERNAL_SERVER_ERROR,
        });
      }
    }
  };

  updateLessonProgress = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user || !user._id) {
        throw new Error(ResponseMessages.USER_NOT_FOUND);
      }

      const userId = user._id.toString();
      const { courseId, lessonId } = req.params;
      if (!courseId || !lessonId) {
        throw new Error(ResponseMessages.COURSE_ID_OR_LESSON_ID_MISSING);
      }
      const { isCompleted, playbackPosition } = req.body;

      const progress = await this.updateLessonProgressUseCase.execute(
        userId,
        courseId,
        lessonId,
        isCompleted,
        playbackPosition
      );

      res
        .status(HttpStatus.OK)
        .json({ message: ResponseMessages.LESSON_PROGRESS_UPDATED, progress });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.PROGRESS_UPDATE_ERROR });
    }
  };

  getLessonProgress = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId } = req.params;

      if (!courseId) {
        throw new Error(ResponseMessages.COURSE_ID_REQUIRED);
      }
      const user = req.user as IUser;
      if (!user || !user._id) {
        throw new Error(ResponseMessages.USER_NOT_FOUND);
      }

      const userId = user._id.toString();

      const progress = await this.fetchLessonProgressUseCase.execute(
        userId,
        courseId
      );

      if (!progress) {
        throw new Error(ResponseMessages.LESSON_PROGRESS_NOT_FOUND);
      }

      res.status(HttpStatus.OK).json(progress);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.PROGRESS_FETCH_ERROR });
    }
  };

  generateCertificate = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user || !user._id) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: ResponseMessages.UNAUTHORIZED });
        return;
      }

      const userId = user._id.toString();
      const { courseId } = req.params;
      if (!courseId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: ResponseMessages.COURSE_ID_REQUIRED });
        return;
      }

      const certificate = await this.certificateCreationUseCase.execute(
        userId,
        courseId
      );

      if (!certificate) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: ResponseMessages.CERTIFICATE_NOT_GENERATED,
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        message: ResponseMessages.CERTIFICATE_GENERATED,
        certificate,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.CERTIFICATE_ERROR });
    }
  };
}
