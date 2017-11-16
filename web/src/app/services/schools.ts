import { Injectable } from '@angular/core';
import { School } from './../models/school';
import { SCHOOLS } from './../mock-db/schools';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SchoolService {
	constructor(private http: HttpClient) {}

	getSchools(): Promise<any> {
		return this.http.get(environment.api + 'schools').toPromise();
	}
}
