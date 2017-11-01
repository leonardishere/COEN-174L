import { Injectable } from '@angular/core';
import { ForeignCourse2 } from './../models/foreign_course2';
import { LocalCourse2 } from './../models/local_course2';

import { Http } from '@angular/http';
import { environment } from '../../environments/environment'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LocalCourseService {
	constructor(private http: Http) {}
	
	getLocalCourses(): Promise<any[]> {
		return this.http.get(environment.api + 'local_courses').toPromise()
		.then(response => response.json())
	}

  addEquivCourse(course): Promise<any> {
	  return this.http.post(environment.api + 'equiv_course', course).toPromise();
  }

  deleteEquivCourse(course): Promise<any> {
	  return this.http.delete(environment.api + 'equiv_course/'+course.EquivID).toPromise();
  }

  editEquivCourse(course): Promise<any> {
	  return this.http.put(environment.api + 'equiv_course/'+course.EquivID, course).toPromise();
  }
  
  addLocalCourse(course): Promise<any>{
	  return this.http.post(environment.api + 'local_courses', course).toPromise();
  }
}
