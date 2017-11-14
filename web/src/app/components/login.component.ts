import { Component, OnInit } from '@angular/core';
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

  constructor() { }

  ngOnInit() {
	  //window.location.href = this.redirectUrl;
  }
}
