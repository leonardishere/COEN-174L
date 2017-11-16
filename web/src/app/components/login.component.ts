import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment'

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
		          private auth: AuthService) { }

	ngOnInit() {
    if (this.auth.isLoggedIn()) {
      console.log('Already logged in');
      this.router.navigate(['/']);
    } else {
      let token = this.route.snapshot.queryParams.token;
      if (this.auth.logIn(token)) {
        console.log('Logged in successfully');
        if (this.auth.redirectUrl) {
          this.router.navigate([this.auth.redirectUrl]);
        }
      }
    }
	}
}
