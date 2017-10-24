import { Injectable } from '@angular/core';
import { LocalCourse } from './models/local_course';
import { LOCAL_COURSES } from './mock-db/local_courses';
import { EquivCourseJoined } from './models/equiv_course_joined';
import { EQUIV_COURSES } from './mock-db/equiv_courses';
import { LocalCourseJoined } from './models/local_course_joined';
import { LOCAL_COURSES_2 } from './mock-db/local_courses_2';
import { User } from './models/user';
import { USERS } from './mock-db/users';
import { ChangeJoined } from './models/change_joined';
import { CHANGES } from './mock-db/changes';

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

@Injectable()
export class LocalCourseService {
  getLocalCourses(): Promise<LocalCourseJoined[]> {
    return Promise.resolve(LOCAL_COURSES_2); //TODO: Use HTTP GET to api server
  }
}

@Injectable()
export class UserService {
  getUsers(): Promise<User[]> {
    return Promise.resolve(USERS); //TODO: Use HTTP GET to api server
  }
}

@Injectable()
export class ChangeService {
  getChanges(): Promise<ChangeJoined[]> {
    return Promise.resolve(CHANGES); //TODO: Use HTTP GET to api server
  }
}