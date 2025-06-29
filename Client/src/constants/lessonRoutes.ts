export const LESSON_ROUTES = {
  LESSONS_BY_COURSE: (courseId: string) => `/courses/${courseId}/lessons`,
  SINGLE_LESSON: (lessonId: string) => `/courses/lessons/${lessonId}`,
};
