import { Component, OnInit } from '@angular/core';
import { User } from './../models/users';
import { UserService } from './../services/users';

@Component({
	selector: 'users',
	template: `
		<h1>Users</h1>
		<table>
			<tr>
				<th>User Name</th>
				<th>Email</th>
				<th>Position</th>
			</tr>
			<tr *ngFor="let user of users" (click)="onSelect(user)">
				<td>{{user.Name}}</td>
				<td>{{user.Email}}</td>
				<td>{{user.Position}}</td>
	`,
	styles: [``]
})
export class UserComponent implements OnInit {
  users: User[];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().then(users =>
      this.users = users
    );
  }

  onSelect(user: User): void {
    console.log('Selected', user);
  }
}