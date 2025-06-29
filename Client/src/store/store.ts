import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import otpReducer from "./features/otpSlice";
import adminReducer from "./features/adminSlice";
import categoryReducer from "./features/categorySlice";
import courseReducer from "./features/courseSlice";
import lessonReducer from "./features/lessonSlice";
import courseBundleReducer from "./features/courseBundleSlice";
import wishlistReducer from "./features/wishlistSlice";
import cartReducer from "./features/cartSlice";
import enrollmentReducer from "./features/enrollmentSlice";
import orderReducer from "./features/orderSlice";
import reviewReducer from "./features/reviewSlice";
import classReducer from "./features/classSlice";
import webRTCReducer from "./features/webRTCSlice";
import notificationReducer from "./features/notificationSlice";
import chatReducer from "./features/chatSlice";
import couponReducer from "./features/couponSlice";
import dashboardReducer from "./features/dashboardSlice";
import salesReportReducer from "./features/salesReportSlice";
import { createSerializableStateInvariantMiddleware } from "@reduxjs/toolkit";
const serializableMiddleware = createSerializableStateInvariantMiddleware({
  ignoredActions: [
    "webRTC/setupLocalStream/fulfilled",
    "webRTC/addRemoteStream",
    "webRTC/shareScreen/fulfilled",
  ],
  ignoredPaths: [
    "webRTC.localStream",
    "webRTC.remoteStreams",
    "webRTC.screenSharingStream",
    "webRTC.peerConnections",
  ],
});
const store = configureStore({
  reducer: {
    user: userReducer,
    otp: otpReducer,
    admin: adminReducer,
    category: categoryReducer,
    course: courseReducer,
    lesson: lessonReducer,
    bundle: courseBundleReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    enrollment: enrollmentReducer,
    order: orderReducer,
    review: reviewReducer,
    class: classReducer,
    webRTC: webRTCReducer,
    notification: notificationReducer,
    chat: chatReducer,
    coupon: couponReducer,
    dashboard: dashboardReducer,
    salesReport: salesReportReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(serializableMiddleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
