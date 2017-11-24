import { Injectable } from '@angular/core';
import { ForeignCourse2 } from './../models/foreign_course2';
import { LocalCourse2 } from './../models/local_course2';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LocalCourseService {
	constructor(private http: HttpClient) {}
	
  //local courses
	getLocalCourses(): Promise<any> {
		return this.http.get(environment.api + 'local_courses').toPromise();
	}
  
  addLocalCourse(course): Promise<any>{
	  return this.http.post(environment.api + 'local_courses', course).toPromise();
  }

  editLocalCourse(course): Promise<any> {
	  return this.http.put(environment.api + 'local_courses/'+course.LocalCourseID, course).toPromise();
  }
  
  deleteLocalCourse(course): Promise<any> {
	  return this.http.delete(environment.api + 'local_courses/'+course.LocalCourseID).toPromise();
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
  
  getForeignCourses(): Promise<any> {
    return this.http.get(environment.api + 'foreign_courses').toPromise();
  }
  
  getLocalCoursesPlain(): Promise<any> {
    return this.http.get(environment.api + 'local_courses_plain').toPromise();
  }
  
  getForeignCoursesSchools(): Promise<any> {
    return this.http.get(environment.api + 'foreign_courses_schools').toPromise();
  }
}
