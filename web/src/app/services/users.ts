import { Injectable } from '@angular/core';
import { User } from './../models/user';
import { USERS } from './../mock-db/users';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
	constructor(private http: HttpClient) {}
	
	getUsers(): Promise<any> {
		return this.http.get(environment.api + 'users').toPromise();
	}  

  addUser(user): Promise<any> {
    return this.http.post(environment.api + 'auth/add', user).toPromise();
  }
  
  editUser(user): Promise<any> {
    return this.http.put(environment.api + 'users/'+user.UserID, user).toPromise();
  }
  
  deleteUser(user): Promise<any> {
    return this.http.delete(environment.api + 'users/'+user.UserID).toPromise();
  }
}
