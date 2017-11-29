import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment'
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SCU Grad Checker';
  loginUrl = environment.loginUrl;
  isAdvisor: boolean;

  constructor(private auth: AuthService,
              private route: ActivatedRoute,
              private http: HttpClient) {
    this.onLoginChanged();
  }

  ngOnInit() {
    this.auth.loginObservable().subscribe(() =>
      setTimeout(() => this.onLoginChanged())
    );

    this.route.queryParams.subscribe(params => {
      this.login(params.token);
    });
    this.login(this.route.snapshot.queryParams.token);
  }

  onLoginChanged() {
      this.isAdvisor = this.auth.isLoggedIn();
  }

  login(token: string) {
    if (token) {
      //Try logging in
      this.auth.token = token;
      return this.http.get(environment.api + 'auth/test').toPromise()
      .then(user => {
        return this.auth.logIn(user);
      });
    }
  }

  logout() {
    this.auth.logOut();
  }
}
