import { Injectable } from '@angular/core';
import { ForeignCourse2 } from './../models/foreign_course2';
import { LocalCourse2 } from './../models/local_course2';
import { LOCAL_COURSES_3 } from './../mock-db/local_courses_3';

@Injectable()
export class LocalCourseService {
  getLocalCourses(): Promise<LocalCourse2[]> {
    return Promise.resolve(LOCAL_COURSES_3); //TODO: Use HTTP GET to api server
  }
}