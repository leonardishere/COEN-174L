import { LocalCourse3 } from './local_course3';

export class ForeignCourse3 {
  ForeignCourseID: number;
  ForeignCourseDept: string;
  ForeignCourseNum: string;
  ForeignCourseTitle: string;
	ForeignCourseName: string;
  SchoolID: number;
	SchoolName: string;
	LocalCourses: Array<LocalCourse3>;
};