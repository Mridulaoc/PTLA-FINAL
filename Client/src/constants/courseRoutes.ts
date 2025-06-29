export const COURSE_ROUTES = {
  ALL_COURSES: "/all-courses",
  UPLOAD_IMAGE: "/upload-featured-image",
  UPLOAD_INTRO_VIDEO: "/upload-intro-video",
  COURSES: "/courses",
  POPULAR_COURSES: "/popular-courses",
  CERTIFICATE: (courseId: string) => `/${courseId}/certificate`,
  LESSON_PROGRESS: (courseId: string) => `/${courseId}/lessons/progress`,
  UPDATE_LESSON: (courseId: string, lessonId: string) =>
    `/${courseId}/lessons/${lessonId}/progress`,
  BY_ID: (courseId: string) => `/courses/${courseId}`,
};
