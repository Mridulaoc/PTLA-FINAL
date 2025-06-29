export const REVIEW_ROUTES = {
  COURSE_REVIEWS: (courseId: string) => `/${courseId}/reviews`,
  SINGLE_REVIEW: (courseId: string, reviewId: string) =>
    `/${courseId}/reviews/${reviewId}`,
  FETCH_ALL: "/all-reviews",
};
