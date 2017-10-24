import { Injectable } from '@angular/core';
import { User } from './../models/user';
import { USERS } from './../mock-db/users';

@Injectable()
export class UserService {
  getUsers(): Promise<User[]> {
    return Promise.resolve(USERS); //TODO: Use HTTP GET to api server
  }
}