import { Injectable } from '@angular/core';
import { ForeignCourseJoined } from './../models/foreign_course_joined';
import { FOREIGN_COURSES } from './../mock-db/foreign_courses';

import { Http } from '@angular/http';
import { environment } from '../../environments/environment'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ForeignCourseService {
	constructor(private http: Http) {}
	
	getForeignCourses(): Promise<any[]> {
		return this.http.get(environment.api + 'foreign_courses').toPromise()
		.then(response => response.json())
	}
}