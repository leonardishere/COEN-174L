import { ForeignCourse2 } from './foreign_course2';

export class LocalCourse2 {
	LocalCourseID: number;
  LocalCourseDept: string;
  LocalCourseNum: string;
  LocalCourseTitle: string;
	LocalCourseName: string;
	ForeignCourses: Array<ForeignCourse2>;
};