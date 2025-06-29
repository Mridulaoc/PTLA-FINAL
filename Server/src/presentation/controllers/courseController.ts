import { Request, Response } from "express";
import fs from "fs";
import { AddCourseUseCase } from "../../application/use-cases/course/addNewCourseUseCase";
import { UploadFeaturedImageUsecase } from "../../application/use-cases/course/uploadFeaturedImageUseCase";
import { UploadIntroVideoUsecase } from "../../application/use-cases/course/uploadIntroVideoUseCase";
import { GetPublicCoursesUsecase } from "../../application/use-cases/course/getPublicCoursesUsecase";
import { FetchCourseDetailsUseCase } from "../../application/use-cases/course/fetchCourseDetailsUsecase";
import { UpdateCourseDetailsUseCase } from "../../application/use-cases/course/updateCourseDetailsUseCase";
import { DeleteCourseUsecase } from "../../application/use-cases/course/deleteCourseUseCase";
import { GetPopularCoursesUseCase } from "../../application/use-cases/course/getPopularCoursesUseCase";
import { FetchCoursesUseCase } from "../../application/use-cases/course/fetchCoursesUseCase";
import { HttpStatus } from "../constants/HttpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";

export class CourseController {
  constructor(
    private addCourseUseCase: AddCourseUseCase,
    private uplaodFeaturedImageUsecase: UploadFeaturedImageUsecase,
    private uploadIntroVideoUseCase: UploadIntroVideoUsecase,
    private fetchCoursesUseCase: FetchCoursesUseCase,
    private getPublicCourseUseCase: GetPublicCoursesUsecase,
    private fetchCourseDetailsUseCase: FetchCourseDetailsUseCase,
    private updateCourseDetailsUseCase: UpdateCourseDetailsUseCase,
    private deleteCourseUseCase: DeleteCourseUsecase,
    private getPopularCoursesUseCase: GetPopularCoursesUseCase
  ) {}

  addNewCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.addCourseUseCase.execute(req.body);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "A course with the same name already exists."
      ) {
        res.status(HttpStatus.CONFLICT).json({ message: error.message });
        return;
      }
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.ADD_COURSE_FAILED });
    }
  };

  uploadFeaturedImage = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: ResponseMessages.FILE_NOT_UPLOADED });
        return;
      }

      const featuredImageUrl = await this.uplaodFeaturedImageUsecase.execute(
        req.file.path
      );
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.log("Error deleting file:", err);
        }
      });

      res.status(HttpStatus.OK).json(featuredImageUrl);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message:
            error.message || ResponseMessages.UPLOAD_FEATURED_IMAGE_FAILED,
        });
      }
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
    }
  };

  uploadIntroVideo = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: ResponseMessages.FILE_NOT_UPLOADED });
        return;
      }
      const introVideoUrl = await this.uploadIntroVideoUseCase.execute(
        req.file.path
      );
      res.status(HttpStatus.OK).json(introVideoUrl);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: error.message || ResponseMessages.UPLOAD_INTRO_VIDEO_FAILED,
        });
      }
    }
  };
  getAllCourses = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const { courses, total } = await this.fetchCoursesUseCase.execute(
        page,
        limit
      );

      res.status(HttpStatus.OK).json({ courses, total, page, limit });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.FETCH_COURSES_FAILED });
    }
  };

  getAllPublicCourses = async (req: Request, res: Response): Promise<void> => {
    try {
      let page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 3;

      const { search, category, sort } = req.query;

      const { total, courses } = await this.getPublicCourseUseCase.execute(
        page,
        limit,
        search as string,
        category as string,
        sort as string
      );

      res.status(HttpStatus.OK).json({ courses, total, page, limit });
    } catch (error) {
      console.error("Error fetching public courses:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.FETCH_COURSES_FAILED });
    }
  };

  getCourseDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const courseId = req.params.courseId;
      if (!courseId) {
        throw new Error("CourseId not found");
      }
      const course = await this.fetchCourseDetailsUseCase.execute(courseId);
      if (!course) {
        throw new Error("Course not found");
      }

      res.status(HttpStatus.OK).json(course);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: error instanceof Error ? error.message : "Error occurred",
      });
    }
  };

  updateCourseDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const courseId = req.params.courseId;
      const courseData = req.body;

      const updatedCourse = await this.updateCourseDetailsUseCase.execute(
        courseId,
        courseData
      );

      res.status(HttpStatus.OK).json({
        message: ResponseMessages.COURSE_UPDATED,
        course: updatedCourse,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const courseId = req.params.courseId;
      const result = await this.deleteCourseUseCase.execute(courseId);
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
            : ResponseMessages.DELETE_COURSE_FAILED,
      });
    }
  };

  getPopularCourses = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const courses = await this.getPopularCoursesUseCase.execute(limit);
      res.status(HttpStatus.OK).json(courses);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.FETCH_COURSES_FAILED });
    }
  };
}
