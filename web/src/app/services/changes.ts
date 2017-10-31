import { Injectable } from '@angular/core';
import { ChangeJoined } from './../models/change_joined';
import { CHANGES } from './../mock-db/changes';

import { Http } from '@angular/http';
import { environment } from '../../environments/environment'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ChangeService {
	constructor(private http: Http) {}
  
	getChanges(): Promise<any[]> {
		return this.http.get(environment.api + 'changes').toPromise()
		.then(response => response.json())
	}
}