import { Injectable, Inject }       from '@angular/core';
import { DOCUMENT }         from '@angular/common';
import {
  CanActivate, CanActivateChild, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                           from '@angular/router';
import { environment } from '../environments/environment'
import { AuthService }      from './services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService,
    private router: Router,
    @Inject(DOCUMENT) private document: any) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkLogin(url: string): boolean {
    if (this.auth.isLoggedIn()) { return true; }

    // Store the attempted URL for redirecting
    this.auth.redirectUrl = url;

    // Navigate to the login page with extras
    console.log('Not logged in. Redirecting to login page');
    this.document.location.href = environment.loginUrl;
    return false;
  }
}
