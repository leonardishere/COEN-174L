import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class AuthService {
  @LocalStorage() redirectUrl: string;
  loginChanges = new Subject<boolean>();
  token: string;

  constructor(private storage:LocalStorageService) {
    this.logIn(this.storage.retrieve('token'));
  }

  logIn(token: string): boolean {
    this.token = token;
    this.storage.store('token', token);
    console.log('token:', this.token);
    this.loginChanges.next(true);
    return true;
  }

  logOut(): void {
    this.token = null;
    this.storage.clear('token');
    this.loginChanges.next(false);
  }

  isLoggedIn(): boolean {
    //TODO: Should actually check if token is real
    return !!this.token;
  }

  loginObservable(): Observable<boolean> {
    return this.loginChanges.asObservable();
  }
}

