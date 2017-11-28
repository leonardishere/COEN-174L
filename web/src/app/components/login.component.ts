import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment'
import 'rxjs/add/operator/toPromise';

@Component({
	selector: 'redirect',
	template: `<div class="container">
	<div class="row justify-content-center" style="margin-bottom: 20px;">
	<img width="256" height="256" src="http://books-not-bombs.com/content/images/schools/scu.png" />
	</div>
	<div class="row justify-content-center">
	<a class="btn btn-info" href="{{redirectUrl}}">Login</a>
	</div>
  `
})
export class LoginComponent implements OnInit {
	redirectUrl = environment.api + 'auth';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService,
              private http: HttpClient) { }

	ngOnInit() {
    let token = this.route.snapshot.queryParams.token;
    if (this.auth.isLoggedIn()) {
      console.log('Already logged in');
      this.router.navigate(['/']);
      return;
    }

    if (token) {
      //Try logging in
      this.auth.token = token;
      return this.http.get(environment.api + 'auth/test').toPromise()
      .then(user => {
        return this.auth.logIn(user);
      });
    }
	}
}
