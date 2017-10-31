import { Injectable } from '@angular/core';
import { EquivCourseJoined } from './../models/equiv_course_joined';
import { EQUIV_COURSES } from './../mock-db/equiv_courses';

import { Http } from '@angular/http';
import { environment } from '../../environments/environment'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class EquivCourseService {
	constructor(private http: Http) {}
	
	getEquivCourses(): Promise<any[]> {
		return this.http.get(environment.api + 'equiv_course').toPromise()
		.then(response => response.json())
	}
}