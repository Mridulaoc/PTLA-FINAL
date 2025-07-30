import { IOrder } from "../../../domain/entities/order";
import { ICourseBundleRepository } from "../../../infrastructure/database/repositories/courseBundleRepo";
import { EnrollUserUsecase } from "./enrollUserUseCase";
import { PermanentBundleEnrollmentUseCase } from "./permanentBundleUseCase";
import { TimeLimitedBundleEnrollmentUseCase } from "./timeLimitedBundleEnrollmentUseCase";

export class HandleEnrollmentAfterPaymentUseCase {
  constructor(
    private enrollUserUseCase: EnrollUserUsecase,
    private timeLimitedBundleUseCase: TimeLimitedBundleEnrollmentUseCase,
    private permanentBundleUseCase: PermanentBundleEnrollmentUseCase,
    private bundleRepo: ICourseBundleRepository
  ) {}

  async execute(order: IOrder): Promise<void> {
    for (const item of order.items!) {
      const { itemId, itemType } = item;

      if (itemType === "Course") {
        await this.enrollUserUseCase.execute(
          order.userId.toString(),
          itemId.toString(),
          "auto"
        );
      }

      if (itemType === "Bundle") {
        const bundle = await this.bundleRepo.findBundleById(itemId.toString());
        if (!bundle) continue;
        const courseIds = bundle.courses.map((course: any) =>
          course._id.toString()
        );

        if (bundle.accessType === "limited") {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + bundle.accessPeriodDays!);
          await this.timeLimitedBundleUseCase.execute(
            order.userId.toString(),
            itemId.toString(),
            courseIds,
            expiryDate,
            "auto"
          );
        } else {
          await this.permanentBundleUseCase.execute(
            order.userId.toString(),
            itemId.toString(),
            courseIds,
            "auto"
          );
        }
      }
    }
  }
}
