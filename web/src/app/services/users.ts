import { Injectable } from '@angular/core';
import { User } from './../models/user';
import { USERS } from './../mock-db/users';

import { Http } from '@angular/http';
import { environment } from '../../environments/environment'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
	constructor(private http: Http) {}
	
	getUsers(): Promise<any[]> {
		return this.http.get(environment.api + 'users').toPromise()
		.then(response => response.json())
	}  
}