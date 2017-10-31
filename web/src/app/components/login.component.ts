import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment'

@Component({
  selector: 'redirect',
  template: 'redirecting...'
})
export class LoginComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    window.location.href = environment.api + 'auth';
  }
}
