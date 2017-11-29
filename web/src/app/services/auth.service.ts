import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class AuthService {
  @LocalStorage() token: string;
  @LocalStorage() UserID: number;
  @LocalStorage() Name: number;
  @LocalStorage() Position: string;
  @LocalStorage() Email: string;
  @LocalStorage() redirectUrl: string;
  loginChanges = new Subject<boolean>();

  constructor(private storage: LocalStorageService,
    private router: Router) {
    this.loginChanges.next(this.isLoggedIn());
  }

  logIn(user: any): boolean {
    if (!user) {
      this.logOut();
      return false;
    }

    this.UserID = user.UserID;
    this.Name = user.Name;
    this.Position = user.Position;
    this.Email = user.Email;
    this.loginChanges.next(this.isLoggedIn());

    if (this.redirectUrl) {
      this.router.navigate([this.redirectUrl]);
      this.redirectUrl = null;
    } else {
      this.router.navigate(['/']);
    }
    return true;
  }

  logOut(): void {
    this.token = null;
    this.UserID = -1;
    this.Name = null;
    this.Position = null;
    this.Email = null;
    this.storage.clear('token');
    this.loginChanges.next(false);
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return this.UserID != -1;
  }

  isAdmin(): boolean {
    return this.Position === "Admin";
  }

  loginObservable(): Observable<boolean> {
    return this.loginChanges.asObservable();
  }
}

