import { Request, Response } from "express";
import { FetchAllCoursesUseCase } from "../../application/use-cases/courseBundle/fetchAllCoursesUseCase";
import { AddBundleUseCase } from "../../application/use-cases/courseBundle/addBundleUseCase";
import { FetchBundlesUseCase } from "../../application/use-cases/courseBundle/fetchBundlesUseCase";
import { DeleteBundleUseCase } from "../../application/use-cases/courseBundle/deleteBundleUseCase";
import { FetchBundleDetailsUseCase } from "../../application/use-cases/courseBundle/fetchBundleDetailsUseCase";
import { UpdateBundleUseCase } from "../../application/use-cases/courseBundle/updateBundleUseCase";
import { HttpStatus } from "../constants/HttpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";

export class CourseBundleController {
  constructor(
    private fetchAllCoursesUseCase: FetchAllCoursesUseCase,
    private addBundleUsecase: AddBundleUseCase,
    private fetchBundlesUseCase: FetchBundlesUseCase,
    private deleteBundleUseCase: DeleteBundleUseCase,
    private fetchBundleDetailsUseCase: FetchBundleDetailsUseCase,
    private updateBundleUseCase: UpdateBundleUseCase
  ) {}

  fetchAllCourses = async (req: Request, res: Response): Promise<void> => {
    try {
      const courses = await this.fetchAllCoursesUseCase.execute();

      res.status(HttpStatus.OK).json(courses);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "A bundle with same name already exists."
      ) {
        res.status(HttpStatus.CONFLICT).json({ message: error.message });
        return;
      }
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.FETCH_COURSES_ERROR });
    }
  };

  addNewBundle = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.addBundleUsecase.execute(req.body);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "A Bundle with the same name already exists."
      ) {
        res.status(HttpStatus.CONFLICT).json({ message: error.message });
        return;
      }
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.ADD_BUNDLE_ERROR });
    }
  };

  fetchAllBundles = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const { search, category, sort } = req.query;
      const { bundles, total } = await this.fetchBundlesUseCase.execute(
        page,
        limit,
        search as string,
        category as string,
        sort as string
      );
      res.status(HttpStatus.OK).json({ bundles, total, page, limit });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.FETCH_BUNDLES_ERROR });
    }
  };

  deleteBundle = async (req: Request, res: Response): Promise<void> => {
    try {
      const bundleId = req.params.bundleId;
      const result = await this.deleteBundleUseCase.execute(bundleId);
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
            : ResponseMessages.DELETE_BUNDLE_ERROR,
      });
    }
  };

  getBundleDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const bundleId = req.params.bundleId;
      if (!bundleId) {
        throw new Error("Bundle ID not found");
      }
      const bundle = await this.fetchBundleDetailsUseCase.execute(bundleId);
      if (!bundle) {
        throw new Error("Bundle not found");
      }
      res.status(HttpStatus.OK).json(bundle);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.BUNDLE_ERROR,
      });
    }
  };

  updateBundle = async (req: Request, res: Response): Promise<void> => {
    try {
      const bundleId = req.params.bundleId;
      const bundleData = req.body;

      const updatedBundle = await this.updateBundleUseCase.execute(
        bundleId,
        bundleData
      );

      res.status(HttpStatus.OK).json({
        message: ResponseMessages.BUNDLE_UPDATED_SUCCESS,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.BUNDLE_ERROR,
      });
    }
  };
}
