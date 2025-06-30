import express from "express";
import passport from "passport";
import { userControllerFactory } from "../factories/userControllerFactory";
import { courseControllerFactory } from "../factories/courseControllerFactory";
import { courseBundleFactory } from "../factories/courseBundleFactory";
import { adminControllerFactory } from "../factories/adminControllerFactory";
import { authMiddleware } from "../../infrastructure layer/middleware/authMiddleware";
import { checkBlocked } from "../../infrastructure layer/middleware/checkBlockedMiddleware";
import { profileControllerFactory } from "../factories/profileControllerFactory";
import upload from "../../infrastructure layer/middleware/upload";
import { wishlistControllerFactory } from "../factories/wishlistControllerFactory";
import { userEnrollmentControllerfactory } from "../factories/userEnrollmentControllerFactory";
import { cartControllerFactory } from "../factories/cartControllerFactory";
import { reviewControllerFactory } from "../factories/reviewControllerFactory";
import { classControllerFactory } from "../factories/classControllerFactory";
import { orderContollerFactory } from "../factories/orderControllerFactory";
import { couponControllerFactory } from "../factories/couponControllerFactory";
import { chatControllerFactory } from "../factories/chatControllerFactory";
import { activeUsers, chatNamespace } from "../../app";
import { userNotificationControllerFactory } from "../factories/userNotificationControllerFactory";

const userRouter = express.Router();

const userController = userControllerFactory();
const courseController = courseControllerFactory();
const courseBundleController = courseBundleFactory();
const adminController = adminControllerFactory();
const profileController = profileControllerFactory();
const wishlistController = wishlistControllerFactory();
const userEnrollmentController = userEnrollmentControllerfactory();
const cartController = cartControllerFactory();
const reviewController = reviewControllerFactory();
const classController = classControllerFactory();
const orderController = orderContollerFactory();
const couponController = couponControllerFactory();
const chatController = chatControllerFactory(chatNamespace, activeUsers);
const userNotificationController = userNotificationControllerFactory();

// Google Login Routes
userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
userRouter.post("/auth/google/token", userController.tokenVerification);

// User Auth Routes
userRouter.post("/register", userController.registerUser);
userRouter.post("/verify-otp", userController.verifyOTP);
userRouter.post("/resend-otp", userController.resendOTP);
userRouter.post("/login", userController.login);
userRouter.post("/forgot-password", userController.forgotPassword);
userRouter.post(
  "/verify-password-reset-otp",
  userController.verifyResetPasswordOTP
);
userRouter.post("/reset-password", userController.resetPassword);
userRouter.get("/check-status", userController.checkStatus);

// Guest Routes

userRouter.get("/courses", courseController.getAllPublicCourses);
userRouter.get("/bundles", courseBundleController.fetchAllBundles);
userRouter.get("/bundles/:bundleId", courseBundleController.getBundleDetails);
userRouter.get("/courses/:courseId", courseController.getCourseDetails);
userRouter.get("/popular-courses", courseController.getPopularCourses);
userRouter.get("/categories", adminController.getAllCategories);

// User dashboard Routes
userRouter.get(
  "/profile",
  authMiddleware,
  checkBlocked,
  profileController.getUserProfile
);
userRouter.patch(
  "/settings",
  authMiddleware,
  checkBlocked,
  profileController.updateUserProfile
);
userRouter.patch(
  "/upload-profile-image",
  authMiddleware,
  checkBlocked,
  upload.single("profileImage"),
  profileController.uploadProfileImage
);
userRouter.post(
  "/wishlist",
  authMiddleware,
  checkBlocked,
  wishlistController.addToWishlist
);
userRouter.get(
  "/wishlist",
  authMiddleware,
  checkBlocked,
  wishlistController.getWishlist
);
userRouter.delete(
  "/wishlist/:itemId",
  authMiddleware,
  checkBlocked,
  wishlistController.removeFromWishList
);

userRouter.get(
  "/enrolled-courses",
  authMiddleware,
  checkBlocked,
  cartController.getEnrolledCourses
);

userRouter.get(
  "/enrollment/status/:courseId",
  authMiddleware,
  checkBlocked,
  userEnrollmentController.getEnrollmentStatus
);

userRouter.patch(
  "/:courseId/lessons/:lessonId/progress",
  authMiddleware,
  checkBlocked,
  userEnrollmentController.updateLessonProgress
);

userRouter.get(
  "/:courseId/lessons/progress",
  authMiddleware,
  checkBlocked,
  userEnrollmentController.getLessonProgress
);

userRouter.post(
  "/:courseId/certificate",
  authMiddleware,
  checkBlocked,
  userEnrollmentController.generateCertificate
);

userRouter.post(
  "/change-password",
  authMiddleware,
  checkBlocked,
  profileController.changePassword
);

userRouter.get("/class", classController.getClass);

// Cart Routes
userRouter.post(
  "/cart",
  authMiddleware,
  checkBlocked,
  cartController.addToCart
);
userRouter.get("/cart", authMiddleware, checkBlocked, cartController.getCart);
userRouter.delete(
  "/cart/:itemId",
  authMiddleware,
  checkBlocked,
  cartController.removeFromCart
);

// Review Routes
userRouter.post(
  "/:courseId/reviews",
  authMiddleware,
  checkBlocked,
  reviewController.addReview
);
userRouter.get("/:courseId/reviews", reviewController.fetchCourseReviews);
userRouter.put(
  "/:courseId/reviews/:reviewId",
  authMiddleware,
  checkBlocked,
  reviewController.updateReview
);
userRouter.delete(
  "/:courseId/reviews/:reviewId",
  authMiddleware,
  checkBlocked,
  reviewController.deleteReview
);

// Order-Payment Routes
userRouter.get("/getKey", authMiddleware, checkBlocked, orderController.getKey);
userRouter.post(
  "/create-order",
  authMiddleware,
  checkBlocked,
  orderController.createOrder
);
userRouter.post("/verify-payment", orderController.verifyAndSaveOrder);
userRouter.post("/confirm-payment", orderController.confirmPayment);
userRouter.post(
  "/cancel-payment",
  authMiddleware,
  checkBlocked,
  orderController.cancelPayment
);
userRouter.post(
  "/retry-payment",
  authMiddleware,
  checkBlocked,
  orderController.retryPayment
);
userRouter.get(
  "/orders",
  authMiddleware,
  checkBlocked,
  orderController.getUserOrders
);
userRouter.put(
  "/:orderId/refund",
  authMiddleware,
  checkBlocked,
  orderController.requestRefund
);
userRouter.post(
  "/orders/validate-coupon",
  authMiddleware,
  checkBlocked,
  couponController.validateCoupon
);

// Notification Routes
userRouter.get(
  "/:userId/notifications",
  authMiddleware,
  checkBlocked,
  userNotificationController.getUserNotifications
);

userRouter.put(
  "/notifications/:notificationId/read",
  authMiddleware,
  checkBlocked,
  userNotificationController.markNotificationAsRead
);

userRouter.put(
  "/notifications/read",
  authMiddleware,
  checkBlocked,
  userNotificationController.markAllNotificationsAsRead
);

userRouter.get(
  "/notifications/unread",
  authMiddleware,
  checkBlocked,
  userNotificationController.getUnreadNotificationCount
);

// Chat Routes

userRouter.get(
  "/chats",
  authMiddleware,
  checkBlocked,
  chatController.getStudentChats
);
userRouter.post(
  "/create/chats",
  authMiddleware,
  checkBlocked,
  chatController.getOrCreateChat
);
userRouter.get(
  "/chats/:chatId",
  authMiddleware,
  checkBlocked,
  chatController.getChat
);
userRouter.get(
  "/get-adminId",
  authMiddleware,
  checkBlocked,
  chatController.getAdminId
);

export default userRouter;
