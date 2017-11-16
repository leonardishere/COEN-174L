import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SCU Grad Checker';
  isAdvisor: boolean;

  constructor(private router: Router,
              private auth: AuthService) {
    this.onLoginChanged();
  }

  ngOnInit() {
    this.auth.loginObservable().subscribe(() =>
      setTimeout(() => this.onLoginChanged())
    );
  }

  onLoginChanged() {
      this.isAdvisor = this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logOut();
    this.router.navigate(['/']);
  }
}
