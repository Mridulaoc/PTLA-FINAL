import { CancelPaymentUseCase } from "../../application/use-cases/order/cancelPaymentUseCase";
import { ConfirmPaymentUseCase } from "../../application/use-cases/order/confirmPaymentUseCase";
import { CreateOrderUseCase } from "../../application/use-cases/order/createOrderUseCase";
import { FetchUserOrdersUseCase } from "../../application/use-cases/order/fetchUserOrdersUseCase";
import { GetAllOrdersUseCase } from "../../application/use-cases/order/getAllOrdersUsecase";
import { GetSalesReportUseCase } from "../../application/use-cases/order/getSalesReportUseCase";
import { ProcessRefundUseCase } from "../../application/use-cases/order/processRefundUseCase";
import { RequestRefundUseCase } from "../../application/use-cases/order/requestRefundUseCase";
import { RetryPaymentUseCase } from "../../application/use-cases/order/retryPaymentUseCase";
import { VerifyPaymentUseCase } from "../../application/use-cases/order/verifyPaymentUseCase";
import { EnrollUserUsecase } from "../../application/use-cases/userEnrollment/enrollUserUseCase";
import { HandleEnrollmentAfterPaymentUseCase } from "../../application/use-cases/userEnrollment/handleEnrollmentAfterPaymentUseCase";
import { PermanentBundleEnrollmentUseCase } from "../../application/use-cases/userEnrollment/permanentBundleUseCase";
import { TimeLimitedBundleEnrollmentUseCase } from "../../application/use-cases/userEnrollment/timeLimitedBundleEnrollmentUseCase";
import {
  CouponRepository,
  ICouponRepository,
} from "../../infrastructure layer/database/repositories/couponRepo";
import {
  CourseBundleRepository,
  ICourseBundleRepository,
} from "../../infrastructure layer/database/repositories/courseBundleRepo";
import {
  CourseRepository,
  ICourseRepository,
} from "../../infrastructure layer/database/repositories/courseRepo";
import {
  IOrderRepository,
  OrderRepository,
} from "../../infrastructure layer/database/repositories/orderRepo";
import {
  IUserRepository,
  UserRepository,
} from "../../infrastructure layer/database/repositories/userRepo";
import {
  EmailService,
  IEmailService,
} from "../../infrastructure layer/services/emailService";
import {
  IPaymentService,
  RazorpayService,
} from "../../infrastructure layer/services/razorpayServices";
import { OrderController } from "../controllers/orderController";

export const orderContollerFactory = (): OrderController => {
  const orderRepo: IOrderRepository = new OrderRepository();
  const couponRepo: ICouponRepository = new CouponRepository();
  const userRepo: IUserRepository = new UserRepository();
  const courseRepo: ICourseRepository = new CourseRepository();
  const bundleRepo: ICourseBundleRepository = new CourseBundleRepository();

  const paymentService: IPaymentService = new RazorpayService();
  const emailService: IEmailService = new EmailService();

  const enrollUserUseCase = new EnrollUserUsecase(userRepo, courseRepo);
  const timeLimitedBundleUseCase = new TimeLimitedBundleEnrollmentUseCase(
    userRepo,
    courseRepo
  );
  const permanentBundleUseCase = new PermanentBundleEnrollmentUseCase(
    userRepo,
    courseRepo,
    bundleRepo
  );
  const handleEnrollmentAfterPaymentUseCase =
    new HandleEnrollmentAfterPaymentUseCase(
      enrollUserUseCase,
      timeLimitedBundleUseCase,
      permanentBundleUseCase,
      bundleRepo
    );
  const createOrderUseCase = new CreateOrderUseCase(
    orderRepo,
    couponRepo,
    paymentService
  );
  const verifyPaymentUseCase = new VerifyPaymentUseCase(
    orderRepo,
    couponRepo,
    userRepo,
    paymentService,
    emailService,
    handleEnrollmentAfterPaymentUseCase
  );
  const confirmPaymentUseCase = new ConfirmPaymentUseCase(orderRepo);
  const cancelPaymentUseCase = new CancelPaymentUseCase(orderRepo);
  const fetchUserOrdersUseCase = new FetchUserOrdersUseCase(userRepo);
  const retryPaymentUseCase = new RetryPaymentUseCase(
    orderRepo,
    paymentService
  );
  const requestRefundUseCase = new RequestRefundUseCase(
    orderRepo,
    bundleRepo,
    userRepo,
    paymentService
  );
  const processRefundUseCase = new ProcessRefundUseCase(orderRepo);
  const getAllOrdersUseCase = new GetAllOrdersUseCase(orderRepo);
  const getSalesReportUseCase = new GetSalesReportUseCase(orderRepo);

  return new OrderController(
    createOrderUseCase,
    verifyPaymentUseCase,
    confirmPaymentUseCase,
    cancelPaymentUseCase,
    fetchUserOrdersUseCase,
    retryPaymentUseCase,
    requestRefundUseCase,
    processRefundUseCase,
    getAllOrdersUseCase,
    getSalesReportUseCase
  );
};
