import { ObjectId } from "mongodb";
import { ICourse } from "./Course";
import { ICoupon } from "./Coupon";

export interface ICartItem {
  item: ObjectId | string;
  itemType: "Course" | "Bundle";
}

export interface IWishlistItem {
  item: ObjectId | string;
  itemType: "Course" | "Bundle";
}

export interface IEnrolledCourse {
  courseId: {
    _id: string;
    title: string;
    description: string;
    featuredImage: string;
    durationHours: number;
    durationMinutes: number;
    lessons: string[];
    visibility: string;
  };
  enrollmentType: "manual" | "auto";
  enrolledAt: Date;
  progress: number;
  bundleId?: {
    _id: string;
    accessType: "lifetime" | "limited";
    title: string;
  } | null;
  expiryDate?: Date | null;
  isActive?: boolean;
}
export interface IEnrolledBundle {
  bundleId: ObjectId | string;
  enrollmentType: "manual" | "auto";
  enrolledAt: Date;
  expiryDate?: Date | null;
  isActive?: boolean;
}
export interface IUsedCoupon {
  couponId: ObjectId | string;
}

export interface IUser {
  _id: ObjectId | string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  isVerified: boolean | null;
  otp?: string | null;
  otpExpiry?: Date | null;
  googleId?: string | null;
  signInMethod: string;
  profileImg?: string;
  phone?: string | null;
  occupation?: string | null;
  dateOfBirth?: Date | null;
  bio?: string | null;
  isBlocked: boolean | null;
  cart?: ICartItem[];
  cartTotal?: number;
  wishlist?: IWishlistItem[];
  enrolledCourses?: IEnrolledCourse[];
  enrolledBundles?: IEnrolledBundle[];
  createdAt?: Date;
  updatedAt?: Date;
  usedCoupons?: IUsedCoupon[];
}

export interface IGoogleProfile {
  emails?: Array<{ value: string }>;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  id: string;
  photos?: Array<{ value: string }>;
}
