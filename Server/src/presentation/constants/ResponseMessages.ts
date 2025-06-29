export const ResponseMessages = {
  // common

  UNAUTHORIZED: "Unauthorized",
  INTERNAL_SERVER_ERROR: "Internal server error",
  COURSE_ID_REQUIRED: "Course ID is required",
  MISSING_FIELDS: "Missing required fields",
  FETCH_COURSES_FAILED: "Failed to fetch courses",
  FETCH_BUNDLES_ERROR: "An error occurred while fetching bundle ",
  USER_NOT_FOUND: "User not found",

  // user controller

  USER_REGISTERED: "User registered successfully. OTP sent to email.",
  OTP_RESENT: "OTP resent successfully",
  INVALID_TOKEN_PAYLOAD: "Invalid token payload",
  GOOGLE_TOKEN_REQUIRED: "Google token is required.",
  FAILED_TO_VERIFY_GOOGLE_TOKEN: "Failed to verify Google token",

  // admin controller

  INVALID_CREDENTIALS: "Invalid credentials",
  USER_BLOCKED: "User Blocked",
  USER_FETCH_ERROR: "Error fetching users",
  CATEGORY_CREATED: "Category created successfully",
  CATEGORY_EXISTS: "A category with the same name already exists.",
  CATEGORY_FETCH_ERROR: "Error fetching category",
  CATEGORY_NOT_FOUND: "Category not found",
  CATEGORY_UPDATED: "Category updated successfully",
  CATEGORY_UPDATE_ERROR: "Error updating category",
  CATEGORY_DELETE_ERROR: "Error deleting category",
  DASHBOARD_FETCH_ERROR: "Failed to fetch dashboard statistics",
  REQUIRED_NAME_DESC: "Name and description are required",

  // cart controller

  ITEM_ADDED_SUCCESS: (itemType: string) =>
    `${itemType} added to cart successfully`,
  ITEM_ADD_FAILED: "Failed to add course to cart",
  ITEM_REMOVED_SUCCESS: (itemType: string) =>
    `${itemType} removed from cart successfully`,
  ITEM_REMOVE_FAILED: "Failed to remove course from cart",
  FETCH_CART_FAILED: "Failed to fetch cart",
  FETCH_ENROLLED_FAILED: "Failed to fetch enrolled courses",

  // chat controller
  ADMIN_ID_REQUIRED: "Admin id is required",
  CHAT_NOT_FOUND: "Chat not found",
  CHATS_NOT_FOUND: "Chats not found",

  //  class controller

  INVALID_DAY: "Invalid day of the week",
  INVALID_TIME_FORMAT: "Invalid time format",
  INVALID_DURATION: "Duration must be greater than 0",
  CLASS_SCHEDULED: "Class scheduled successfully",
  CLASS_NOT_FOUND: "Class not found",
  FETCH_CLASS_ERROR: "Error fetching class",

  // coupon controller

  COUPON_CREATED: "Coupon added successfully",
  COUPON_UPDATED: "Coupon updated successfully",
  APPLIED_SUCCESS: "Coupon applied successfully",
  COUPON_CREATION_ERROR: "Error creating coupon",
  COUPONS_FETCH_ALL_ERROR: "An error occurred while fetching all coupons",
  COUPON_FETCH_ONE_ERROR: "An error occurred while fetching the coupon",
  COUPON_VALIDATION_ERROR: "Error validating coupon",
  DUPLICATE_CODE: "A coupon with the same code already exists.",
  ALREADY_USED: "You have already used this coupon",
  INVALID_OR_EXPIRED: "Invalid or expired coupon code",
  COUPON_NOT_FOUND: "Coupon not found",
  MISSING_CODE: "Coupon code is required",

  // course bundle

  BUNDLE_EXISTS: "A Bundle with the same name already exists.",
  BUNDLE_NOT_FOUND: "Bundle not found",
  BUNDLE_ID_NOT_FOUND: "Bundle ID not found",
  FETCH_COURSES_ERROR: "Error fetching courses",
  ADD_BUNDLE_ERROR: "Error adding bundle",
  DELETE_BUNDLE_ERROR: "Failed to delete the bundle",
  BUNDLE_ERROR: "An error occurred",
  BUNDLE_UPDATED_SUCCESS: "Course updated successfully",

  // ciurse controller

  COURSE_ADDED: "Course added successfully",
  COURSE_UPDATED: "Course updated successfully",
  COURSE_DELETED: "Course deleted successfully",
  FEATURED_IMAGE_UPLOADED: "Featured image uploaded successfully",
  INTRO_VIDEO_UPLOADED: "Intro video uploaded successfully",
  COURSE_EXISTS: "A course with the same name already exists.",
  COURSE_NOT_FOUND: "Course not found",
  COURSE_ID_NOT_FOUND: "CourseId not found",
  ADD_COURSE_FAILED: "Error adding course",
  DELETE_COURSE_FAILED: "Failed to delete the course",
  UPLOAD_FEATURED_IMAGE_FAILED: "Failed to upload featured image",
  UPLOAD_INTRO_VIDEO_FAILED: "Failed to upload intro video",
  FILE_NOT_UPLOADED: "No file uploaded",

  // enrollment controller

  USER_ENROLLED: "User enrolled successfully",

  // lesson controller

  LESSONS_ADDED: "Lessons added successfully",
  LESSONS_FETCHED: "Lessons fetched successfully",
  LESSON_UPDATED: "Lesson updated successfully",
  LESSON_DELETED: "Lesson deleted successfully",
  INVALID_REQUEST: "Invalid request. Course ID and lessons array are required.",
  MISSING_LESSON_FIELDS: "Each lesson must have a title and description.",
  LESSON_ADD_FAILED: "Error adding lessons",
  LESSON_FETCH_FAILED: "Error fetching lessons",
  LESSON_UPDATE_FAILED: "Error updating lesson",
  LESSON_DELETE_FAILED: "Failed to delete the lesson",

  // notification controller

  SPECIFIC_TARGET_REQUIRED:
    "Target users are required for specific notifications",
  TARGET_ENTITY_REQUIRED: (type: string) =>
    `Target entity is required for ${type} notifications`,
  NOTIFICATION_CREATED: "Notification created successfully.",
  NOTIFICATION_CREATE_ERROR: "An error occurred while creating notification",
  NOTIFICATION_DELETE_ERROR: "An error occurred while deleting notification",
  NOTIFICATION_FETCH_ALL_ERROR:
    "An error occurred while fetching all notifications",
  FETCH_USERS_ERROR: "An error occurred while fetching  users",
  FETCH_TARGET_USERS_ERROR:
    "An error occurred while fetching target users for notification",

  // order controller

  RAZORPAY_KEY_MISSING:
    "RAZORPAY_API_KEY is not set in the environment variables",
  PAYMENT_CONFIRMATION_ERROR: "Error confirming payment",
  ORDER_CANCELLED: (reason: string) =>
    `Order ${
      reason === "payment_failed" ? "failed" : "cancelled"
    } successfully`,
  ORDER_FETCH_ERROR: "Error fetching orders",
  RETRY_PAYMENT_ERROR: "Error retrying payment",
  REFUND_REQUEST_ERROR:
    "An error occurred while processing your refund request",
  ORDER_NOT_FOUND: "Order not found",
  REFUND_PROCESS_ERROR: "Server error while processing refund",
  DATE_INVALID: "Invalid date format",
  SALES_REPORT_ERROR: "Failed to generate sales report",
  COULD_NOT_FETCH_ORDERS: "Could not fetch orders",
  ORDER_CREATION_FAILED: "Order creation failed",

  // profile controller

  PROFILE_UPDATED: "Profile updated successfully",
  PROFILE_IMAGE_UPLOAD_SUCCESS: "Profile image uploaded successfully",
  PROFILE_IMAGE_UPLOAD_FAILED: "Failed to upload profile image",
  CHANGE_PASSWORD_SUCCESS: "Password changed successfully",
  CHANGE_PASSWORD_ERROR: "Error changing password",
  OLD_NEW_PASSWORD_REQUIRED: "Old and new password are required",
  NO_FILE_UPLOADED: "No file uploaded",

  // Review controller

  REVIEW_ADDED_SUCCESS: "Review added successfully",
  REVIEW_ADD_FAILED: "Controller Error: Failed to add review",
  REVIEW_UPDATE_SUCCESS: "Review updated successfully",
  REVIEW_UPDATE_FAILED: "Review could not be updated",
  REVIEW_DELETE_SUCCESS: "Review deleted successfully",
  REVIEW_DELETE_FAILED: "Couldn't delete review",
  REVIEW_FETCH_ERROR: "Error fetching reviews",

  // user enrollment controller

  COURSE_ID_OR_LESSON_ID_MISSING: "CourseId or lessonId not found",
  LESSON_PROGRESS_UPDATED: "Lesson progress updated successfully",
  PROGRESS_UPDATE_ERROR: "Error updating progress",
  PROGRESS_FETCH_ERROR: "Could not fetch lesson progress",
  LESSON_PROGRESS_NOT_FOUND: "Lesson progress not found",
  CERTIFICATE_NOT_GENERATED:
    "Cannot generate certificate. Course is not fully completed.",
  CERTIFICATE_GENERATED: "Certificate generated successfully",
  CERTIFICATE_ERROR: "Error generating certificate",

  // user notification controller

  NOTIFICATION_FETCH_FAILED: "Failed to fetch user notifications",
  MARK_READ_SUCCESS: "Notification marked as read",
  MARK_READ_FAILED: "Failed to mark notification as read",
  MARK_ALL_READ_SUCCESS: "All notifications marked as read",
  MARK_ALL_READ_FAILED: "Failed to mark all notifications as read",
  UNREAD_COUNT_FAILED: "Failed to get unread notification count",

  // wishlist controller

  WISHLIST_ITEM_ADDED: "Added to wishlist",
  WISHLIST_ITEM_REMOVED: "Removed from wishlist successfully",
  ITEM_ID_REQUIRED: "ID is required",
  ERROR_ADDING_WISHLIST: "An error occurred while adding to wishlist",
  ERROR_REMOVING_WISHLIST: "Error removing item from wishlist",
  ERROR_FETCHING_WISHLIST: "Error fetching wishlist",
};
