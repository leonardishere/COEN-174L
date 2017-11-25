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
  
  addSchool(school): Promise<any> {
    return this.http.post(environment.api + 'schools', school).toPromise();
  }
  
  editSchool(school): Promise<any> {
    return this.http.put(environment.api + 'schools/'+school.SchoolID, school).toPromise();
  }
  
  deleteSchool(school): Promise<any> {
    return this.http.delete(environment.api + 'schools/'+school.SchoolID).toPromise();
  }
}
