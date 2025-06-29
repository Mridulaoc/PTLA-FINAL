import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import {
  UserProtectedRoute,
  AdminProtectedRoute,
} from "./components/protectedRoute";
import { MainLayout } from "./components/mainLayOut";
import Home from "./pages/home";
import Login from "./pages/login";
import SignupForm from "./pages/signupForm";
import { DashboardLayout } from "./components/dashboardLayout";
import { Profile } from "./pages/profile";
import { AdminLayout } from "./components/adminLayOut";
import AdminLogin from "./pages/adminLogin";
import AdminDashboard from "./pages/adminDashboard";
import Settings from "./pages/settings";
import OtpPage from "./pages/otpPage";
import { ForgotPassword } from "./pages/forgotPassword";
import { VerifyOTP } from "./pages/verifyOTP";
import { ResetPassword } from "./pages/resetPassword";
import { AdminDashboardLayout } from "./components/adminDashboard";
import UserManagement from "./pages/users";
import CategoryManagement from "./pages/categories";
import AddCategory from "./pages/addCategory";
import EditCategory from "./pages/editCategory";
import { CourseForm } from "./pages/courseForm";
import CourseLessons from "./pages/lessons";
import CourseManagement from "./pages/courses";
import LessonsList from "./pages/lessonList";
import { EditCourse } from "./pages/editCourse";
import Courses from "./pages/coursePage";
import CourseDetails from "./pages/courseDetails";
import BundleCreation from "./pages/bundleCreation";
import BundleManagement from "./pages/bundles";
import BundleEdit from "./pages/editBundle";
import CartPage from "./pages/cart";
import CheckoutPage from "./pages/checkout";
import WishlistPage from "./pages/wishlist";
import BundleDetails from "./pages/bundleDetails";
import ManualEnrollmentPage from "./pages/manualEnrollment";
import PaymentSuccessPage from "./pages/paymentSuccessPage";
import OrderHistory from "./pages/orderHistory";
import CourseLearning from "./pages/courseLearning";
import ScheduleClass from "./pages/scheduleClass";
import ClassRoom from "./pages/classRoom";
import Join from "./components/joinLive";
import LiveClassDetails from "./pages/liveclassDetails";
import CreateNotification from "./pages/createNotification";
import NotificationManagement from "./pages/notificationList";
import NotificationsPage from "./pages/notificationPage";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { useEffect } from "react";

import {
  initializeChatSocket,
  disconnectChatSocket,
} from "./sockets/chatSocketService";
import ChangePasswordForm from "./pages/changePassword";
import StudentChat from "./pages/studentChatPage";
import AdminChat from "./pages/adminChatPage";
import { useDispatch } from "react-redux";
import {
  disconnectNotificationSocket,
  initializeNotificationSocket,
} from "./sockets/notificationSocketService";
import {
  disconnectWebRTCSocket,
  initializeWebRTCSocket,
} from "./sockets/webrtcSocketService";
import EnrolledCourses from "./pages/dashboard";
import CouponCreationForm from "./pages/couponCreationForm";
import CouponManagement from "./pages/couponList";
import EditCoupon from "./pages/editCoupon";
import ReviewManagement from "./pages/reviwList";
import PaymentFailedPage from "./pages/paymnetFailedPage";
import PaymentCancelledPage from "./pages/paymentCancelledPage";
import OrderManagement from "./pages/orderList";
import SalesReport from "./pages/salesReport";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { admin: adminId, token: adminToken } = useSelector(
    (state: RootState) => state.admin
  );

  const { user, token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const isAdminRoute = window.location.pathname.startsWith("/admin");

    if (isAdminRoute && adminId && adminToken) {
      initializeChatSocket(adminId, adminToken, true);
      initializeNotificationSocket(adminId, adminToken, true);
      initializeWebRTCSocket(adminId, adminToken, true);
    } else if (!isAdminRoute && user?._id && token) {
      initializeChatSocket(user._id, token, false);
      initializeNotificationSocket(user._id, token, false);
      initializeWebRTCSocket(user._id, token, false);
    }

    return () => {
      if (isAdminRoute && adminId && adminToken) {
        disconnectChatSocket();
        disconnectNotificationSocket();
        disconnectWebRTCSocket();
      } else if (!isAdminRoute && user?._id && token) {
        disconnectChatSocket();
        disconnectNotificationSocket();
        disconnectWebRTCSocket();
      }
    };
  }, [user?._id, token, adminId, adminToken, dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="join" element={<Join />} />
          <Route path="room/:roomId" element={<ClassRoom />} />

          <Route path="login" element={<Login />} />
          <Route path="register" element={<SignupForm />} />
          <Route path="otp/:userId" element={<OtpPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="verify-otp/:userId" element={<VerifyOTP />} />
          <Route path="reset-password/:userId" element={<ResetPassword />} />
          <Route path="paymentSuccess" element={<PaymentSuccessPage />} />
          <Route path="payment-failed" element={<PaymentFailedPage />} />
          <Route path="payment-cancelled" element={<PaymentCancelledPage />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:courseId" element={<CourseDetails />} />
          <Route
            path="/courses/:courseId/liveClassDetails"
            element={
              <UserProtectedRoute>
                <LiveClassDetails />
              </UserProtectedRoute>
            }
          />
          <Route
            path="courses/:courseId/learn"
            element={
              <UserProtectedRoute>
                <CourseLearning />
              </UserProtectedRoute>
            }
          />
          <Route path="bundles/:bundleId" element={<BundleDetails />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route
            path="dashboard"
            element={
              <UserProtectedRoute>
                <DashboardLayout />
              </UserProtectedRoute>
            }
          >
            <Route index element={<EnrolledCourses />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="order-history" element={<OrderHistory />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="change-password" element={<ChangePasswordForm />} />
            <Route path="chat" element={<StudentChat />} />
          </Route>
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminLogin />} />
          <Route
            path="dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboardLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="categories/add" element={<AddCategory />} />
            <Route path="categories/edit/:id" element={<EditCategory />} />
            <Route path="courses" element={<Outlet />}>
              <Route index element={<CourseManagement />} />
              <Route path="add" element={<CourseForm />} />
              <Route path=":courseId/lessons" element={<CourseLessons />} />
              <Route path=":courseId/lessonsList" element={<LessonsList />} />
              <Route path=":courseId" element={<EditCourse />} />
            </Route>
            <Route path="bundles" element={<Outlet />}>
              <Route index element={<BundleManagement />} />
              <Route path="add" element={<BundleCreation />} />
              <Route path=":bundleId" element={<BundleEdit />} />
            </Route>
            <Route path="enrollment" element={<Outlet />}>
              <Route index element={<ManualEnrollmentPage />} />
            </Route>
            <Route path="schedule" element={<Outlet />}>
              <Route index element={<ScheduleClass />} />
            </Route>
            <Route path="notifications" element={<Outlet />}>
              <Route index element={<NotificationManagement />} />
              <Route path="add" element={<CreateNotification />} />
            </Route>
            <Route path="chat" element={<AdminChat />} />
            <Route path="coupons" element={<Outlet />}>
              <Route index element={<CouponManagement />} />
              <Route path="add" element={<CouponCreationForm />} />
              <Route path="edit/:id" element={<EditCoupon />} />
            </Route>
            <Route path="reviews" element={<ReviewManagement />} />
            <Route path="orders" element={<Outlet />}>
              <Route index element={<OrderManagement />} />
            </Route>
            <Route path="sales-report" element={<SalesReport />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
