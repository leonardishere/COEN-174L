import { Injectable } from '@angular/core';
import { LocalCourseJoined } from './../models/local_course_joined';
import { LOCAL_COURSES_2 } from './../mock-db/local_courses_2';

@Injectable()
export class LocalCourseService {
  getLocalCourses(): Promise<LocalCourseJoined[]> {
    return Promise.resolve(LOCAL_COURSES_2); //TODO: Use HTTP GET to api server
  }
}