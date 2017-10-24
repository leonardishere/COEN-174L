import { Injectable } from '@angular/core';
import { ForeignCourseJoined } from './../models/foreign_course_joined';
import { FOREIGN_COURSES } from './../mock-db/foreign_courses';

@Injectable()
export class ForeignCourseService {
  getForeignCourses(): Promise<ForeignCourseJoined[]> {
    return Promise.resolve(FOREIGN_COURSES); //TODO: Use HTTP GET to api server
  }
}