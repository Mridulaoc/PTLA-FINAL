import express from "express";
import { adminMiddleware } from "../../infrastructure/middleware/adminMiddleware";
import upload from "../../infrastructure/middleware/upload";
import uploadVideo from "../../infrastructure/middleware/uploadVideo";
import { adminControllerFactory } from "../factories/adminControllerFactory";
import { courseControllerFactory } from "../factories/courseControllerFactory";
import { lessoControllerFactory } from "../factories/lessonControllerFactory";
import { courseBundleFactory } from "../factories/courseBundleFactory";
import { enrollmentControllerFactory } from "../factories/enrollmentControllerFactory";
import { classControllerFactory } from "../factories/classControllerFactory";
import { notificationControllerFactory } from "../factories/notificationControllerFactory";
import { activeUsers, chatNamespace, notificationNamespace } from "../../app";
import { chatControllerFactory } from "../factories/chatControllerFactory";
import { reviewControllerFactory } from "../factories/reviewControllerFactory";
import { orderContollerFactory } from "../factories/orderControllerFactory";
import { couponControllerFactory } from "../factories/couponControllerFactory";

const adminController = adminControllerFactory();
const courseController = courseControllerFactory();
const lessonController = lessoControllerFactory();
const courseBundleController = courseBundleFactory();
const enrollmentController = enrollmentControllerFactory();
const classController = classControllerFactory();
const notificationController = notificationControllerFactory(
  notificationNamespace
);
const chatController = chatControllerFactory(chatNamespace, activeUsers);
const couponController = couponControllerFactory();
const reviewController = reviewControllerFactory();
const orderController = orderContollerFactory();

const adminRouter = express.Router();

adminRouter.post("/", adminController.login);

adminRouter.get(
  "/dashboard/stats",
  adminMiddleware,
  adminController.getDashboardStats
);

// User Management Routes
adminRouter.get("/users", adminMiddleware, adminController.getAllUsers);
adminRouter.patch(
  "/users/:userId",
  adminMiddleware,
  adminController.toggleBlockUser
);

// Category Management Routes
adminRouter
  .route("/categories")
  .get(adminMiddleware, adminController.getAllCategories)
  .post(adminMiddleware, adminController.addCategory);

adminRouter
  .route("/categories/:id")
  .get(adminMiddleware, adminController.getCategory)
  .patch(adminMiddleware, adminController.editCategory)
  .delete(adminMiddleware, adminController.deleteCategory);

// Course Managemnet Router
adminRouter.post(
  "/upload-featured-image",
  adminMiddleware,
  upload.single("featuredImage"),
  courseController.uploadFeaturedImage
);
adminRouter.post(
  "/upload-intro-video",
  adminMiddleware,
  uploadVideo.single("video"),
  courseController.uploadIntroVideo
);
adminRouter
  .route("/courses")
  .get(adminMiddleware, courseController.getAllCourses)
  .post(adminMiddleware, courseController.addNewCourse);
adminRouter
  .route("/courses/:courseId")
  .get(adminMiddleware, courseController.getCourseDetails)
  .put(adminMiddleware, courseController.updateCourseDetails)
  .delete(adminMiddleware, courseController.deleteCourse);
adminRouter
  .route("/courses/:courseId/lessons")
  .get(adminMiddleware, lessonController.getAllLessons)
  .post(adminMiddleware, lessonController.addLesssons);
adminRouter
  .route("/courses/lessons/:lessonId")
  .put(adminMiddleware, lessonController.updateLesson)
  .delete(adminMiddleware, lessonController.deleteLesson);

// Course Bundle Management
adminRouter.get(
  "/all-courses",
  adminMiddleware,
  courseBundleController.fetchAllCourses
);
adminRouter.post(
  "/bundle",
  adminMiddleware,
  courseBundleController.addNewBundle
);
adminRouter.get(
  "/bundles",
  adminMiddleware,
  courseBundleController.fetchAllBundles
);
adminRouter.delete(
  "/bundles/:bundleId",
  adminMiddleware,
  courseBundleController.deleteBundle
);
adminRouter.put(
  "/bundles/:bundleId",
  adminMiddleware,
  courseBundleController.updateBundle
);

// Manual Enrollment Routes
adminRouter.post(
  "/enrollment",
  adminMiddleware,
  enrollmentController.enrollUser
);
adminRouter.get(
  "/enrollment/users",
  adminMiddleware,
  enrollmentController.getUserSuggestions
);
adminRouter.get(
  "/enrollment/courses",
  adminMiddleware,
  enrollmentController.getCourses
);

// Live Class Routes

adminRouter.post(
  "/schedule-class",
  adminMiddleware,
  classController.scheduleClass
);

// Notification Routes
adminRouter.get(
  "/all-notifications",
  adminMiddleware,
  notificationController.fetchAllNotifications
);
adminRouter.post(
  "/notification",
  adminMiddleware,
  notificationController.createNotification
);
adminRouter.delete(
  "/notifications/:notificationId",
  adminMiddleware,
  notificationController.deleteNotification
);

adminRouter.get(
  "/notifications/users",
  adminMiddleware,
  notificationController.fetchUsersForNotification
);
adminRouter.get(
  "/notifications/courses",
  adminMiddleware,
  notificationController.fetchCourseForNotification
);

adminRouter.get(
  "/notifications/bundles",
  adminMiddleware,
  notificationController.fetchBundleForNotification
);

adminRouter.get(
  "/:entityType/:entityId/enrolledUsers",
  adminMiddleware,
  notificationController.fetchTargetUsersForNotification
);

// Chat Routes
adminRouter.get("/chats", adminMiddleware, chatController.getAdminChats);
adminRouter.post("/chats/create", adminMiddleware, chatController.createChat);
adminRouter.get("/chats/:chatId", adminMiddleware, chatController.getChat);

adminRouter.post("/coupon", adminMiddleware, couponController.createCoupon);
adminRouter.get("/coupon", adminMiddleware, couponController.getCoupons);
adminRouter.get(
  "/coupons/:id",
  adminMiddleware,
  couponController.getCouponById
);
adminRouter.put("/coupons/:id", adminMiddleware, couponController.updateCoupon);
adminRouter.patch(
  "/coupons/:id",
  adminMiddleware,
  couponController.deactivateCoupon
);

// Reviews Router

adminRouter.get(
  "/all-reviews",
  adminMiddleware,
  reviewController.getAllReviews
);

// Order Managemnet Routes

adminRouter.get("/orders", adminMiddleware, orderController.getALLOrders);
adminRouter.put(
  "/process-refund",
  adminMiddleware,
  orderController.processRefund
);
adminRouter.get(
  "/sales-report",
  adminMiddleware,
  orderController.getSalesReport
);

export default adminRouter;
