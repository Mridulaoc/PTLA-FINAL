import { Request, Response } from "express";
import { EnrollUserUsecase } from "../../application/use-cases/enrollment/enrillUserUseCase";
import { GetUserSuggestionsUsecase } from "../../application/use-cases/enrollment/getUserSuggestionsUsecase";
import { GetAllCoursesUseCase } from "../../application/use-cases/enrollment/getAllCoursesUseCase";
import { HttpStatus } from "../constants/HttpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";

export class EnrollmentController {
  constructor(
    private enrollUserUsecase: EnrollUserUsecase,
    private getUserSuggestionsUsecase: GetUserSuggestionsUsecase,
    private getAllCoursesUsecase: GetAllCoursesUseCase
  ) {}

  enrollUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, courseId, enrollmentType } = req.body;
      if (!userId || !courseId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: ResponseMessages.MISSING_FIELDS });
      }
      const updatedUser = await this.enrollUserUsecase.execute(
        userId,
        courseId,
        enrollmentType
      );

      res.status(HttpStatus.OK).json({
        message: ResponseMessages.USER_ENROLLED,
        user: updatedUser,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  };

  getUserSuggestions = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = (req.query.query as string) || "";
      const suggestions = await this.getUserSuggestionsUsecase.execute(query);
      res.status(HttpStatus.OK).json({ suggestions });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  };

  getCourses = async (req: Request, res: Response): Promise<void> => {
    try {
      const courses = await this.getAllCoursesUsecase.execute();

      res.status(HttpStatus.OK).json({ courses });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  };
}
