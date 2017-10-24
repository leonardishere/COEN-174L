import { Injectable } from '@angular/core';
import { EquivCourseJoined } from './../models/equiv_course_joined';
import { EQUIV_COURSES } from './../mock-db/equiv_courses';

@Injectable()
export class EquivCourseService {
  getEquivCourses(): Promise<EquivCourseJoined[]> {
    return Promise.resolve(EQUIV_COURSES); //TODO: Use HTTP GET to api server
  }
}