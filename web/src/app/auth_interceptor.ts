import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {AuthService} from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.token) {
      const authHeader = 'Bearer ' + this.auth.token;
      const authReq = req.clone({setHeaders: {Authorization: authHeader}});
      return next.handle(authReq);
    }
    return next.handle(req);
	}
}
