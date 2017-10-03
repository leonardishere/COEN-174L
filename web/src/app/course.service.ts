import { Injectable } from '@angular/core';
import { LocalCourse } from './models/local_course';
import { LOCAL_COURSES } from './mock-db/local_courses';

@Injectable()
export class CourseService {
  getLocalCourses(): Promise<LocalCourse[]> {
    return Promise.resolve(LOCAL_COURSES); //TODO: Use HTTP GET to api server
  }
}
