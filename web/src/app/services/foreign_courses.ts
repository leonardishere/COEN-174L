import { Injectable } from '@angular/core';
import { ForeignCourseJoined } from './../models/foreign_course_joined';
import { FOREIGN_COURSES } from './../mock-db/foreign_courses';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ForeignCourseService {
	constructor(private http: HttpClient) {}
	
  //foreign courses
	getForeignCourses(): Promise<any> {
		return this.http.get(environment.api + 'foreign_courses').toPromise();
	}
  
  addForeignCourse(course): Promise<any> {
    return this.http.post(environment.api + 'foreign_courses', course).toPromise();
  }
  
  editForeignCourse(course): Promise<any> {
	  return this.http.put(environment.api + 'foreign_courses/'+course.ForeignCourseID, course).toPromise();
  }
  
  deleteForeignCourse(course): Promise<any> {
    return this.http.delete(environment.api + 'foreign_courses/'+course.ForeignCourseID).toPromise();
  }
  
  //equiv courses
  addEquivCourse(course): Promise<any> {
	  return this.http.post(environment.api + 'equiv_course', course).toPromise();
  }
  
  editEquivCourse(course): Promise<any> {
	  return this.http.put(environment.api + 'equiv_course/'+course.EquivID, course).toPromise();
  }
  
  deleteEquivCourse(course): Promise<any> {
	  return this.http.delete(environment.api + 'equiv_course/'+course.EquivID).toPromise();
  }
  
  //other
  getSchools(): Promise<any> {
    return this.http.get(environment.api + 'schools').toPromise();
  }
  
  getLocalCourses(): Promise<any> {
    return this.http.get(environment.api + 'local_courses').toPromise();
  }
  
  getLocalCoursesPlain(): Promise<any> {
    return this.http.get(environment.api + 'local_courses_plain').toPromise();
  }
  
  getForeignCoursesSchools(): Promise<any> {
    return this.http.get(environment.api + 'foreign_courses_schools').toPromise();
  }
}
