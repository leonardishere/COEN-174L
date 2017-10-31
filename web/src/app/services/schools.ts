import { Injectable } from '@angular/core';
import { School } from './../models/school';
import { SCHOOLS } from './../mock-db/schools';

import { Http } from '@angular/http';
import { environment } from '../../environments/environment'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SchoolService {
	constructor(private http: Http) {}

	getSchools(): Promise<any[]> {
		return this.http.get(environment.api + 'schools').toPromise()
		.then(response => response.json())
	}
}