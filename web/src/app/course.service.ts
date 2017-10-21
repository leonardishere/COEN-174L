import { Injectable } from '@angular/core';
import { LocalCourse } from './models/local_course';
import { LOCAL_COURSES } from './mock-db/local_courses';
import { EquivCourseJoined } from './models/equiv_course_joined';
import { EQUIV_COURSES } from './mock-db/equiv_courses';

@Injectable()
export class CourseService {
  getLocalCourses(): Promise<LocalCourse[]> {
    return Promise.resolve(LOCAL_COURSES); //TODO: Use HTTP GET to api server
  }
}

@Injectable()
export class EquivCourseService {
  getEquivCourses(): Promise<EquivCourseJoined[]> {
    return Promise.resolve(EQUIV_COURSES); //TODO: Use HTTP GET to api server
  }
}
