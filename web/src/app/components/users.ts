import { Component, OnInit } from '@angular/core';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { User } from './../models/users';
import { UserService } from './../services/users';

@Component({
  selector: 'users',
  template: `
    <h1>Users</h1>
    <ng2-smart-table
      [settings]="settings"
      [source]="source">
    </ng2-smart-table>
	`,
  styles: [``]
})
export class UserComponent implements OnInit {
  source: LocalDataSource;
  users: User[];
  settings = {
    columns: {
      Name: { title: 'User Name' },
      Email: { title: 'Email' },
      Position: { title: 'Position' }
    }
  };

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().then(users => {
      this.users = users;
      this.source = new LocalDataSource(this.users);
    });
  }

  onSelect(user: User): void {
    console.log('Selected', user);
  }
}
