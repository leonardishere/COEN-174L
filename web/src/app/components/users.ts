import { Component, OnInit } from '@angular/core';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { User } from './../models/users';
import { UserService } from './../services/users';
import { AuthService } from '../services/auth.service';
import { contains } from '../utils';

@Component({
  selector: 'users',
  template: `
    <h1>Users</h1>
    <ng2-smart-table
      [settings]="settings"
      [source]="source"
      (createConfirm)="add($event)"
      (editConfirm)="edit($event)"
      (deleteConfirm)="delete($event)"
      >
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
    },
    pager: {
			perPage: 100
    },
    mode: 'inline',
    add: {
      confirmCreate: true
    },
    edit: {
      confirmSave: true
    },
    delete: {
      confirmDelete: true,
    },
    actions: {
      add: false,
      delete: false,
      edit: false
    }
  };

  constructor(private userService: UserService,
              private auth: AuthService) { }

  ngOnInit(): void {
    this.userService.getUsers().then(users => {
      this.users = users;
      this.source = new LocalDataSource(this.users);
    });
    
    var isAdmin = this.auth.isAdmin();
    this.settings.actions.add = isAdmin;
    this.settings.actions.delete = isAdmin;
    this.settings.actions.edit = isAdmin;
  }

  onSelect(user: User): void {
    console.log('Selected', user);
  }

  add(e: any) {
    console.log('Add', e.newData);
    
    e.newData.Name = e.newData.Name.trim();
    if(e.newData.Name === ""){
      alert("The user name cannot be empty. Try again.");
      return;
    }
    
    e.newData.Email = e.newData.Email.trim();
    if(!contains(e.newData.Email, "@scu.edu")){
      alert("The email address must be under the scu.edu domain. Try again.");
      return;
    }
    
    e.newData.Position = e.newData.Position.trim();
    if(e.newData.Position !== "Admin" && e.newData.Position !== "Advisor"){
      alert("The position must be either 'Admin' or 'Advisor'. Try again.");
      return;
    }
    
    for(var i = 0; i < this.users.length; ++i){
      if(this.users[i].Email === e.newData.Email){
        alert("That email is in use. Refresh and try again.");
        return;
      }
    }
    
    this.userService.addUser(e.newData)
    .then(http => {
      e.newData.UserID = http.row;
      console.log(e.newData);
      e.confirm.resolve(e.newData);
      //console.log(http);
      console.log(this.users);
    });
  }
  
  edit(e: any){
    console.log('Edit', e.newData);
    
    e.newData.Name = e.newData.Name.trim();
    if(e.newData.Name === ""){
      alert("The user name cannot be empty. Try again.");
      return;
    }
    
    e.newData.Email = e.newData.Email.trim();
    if(!contains(e.newData.Email, "@scu.edu")){
      alert("The email address must be under the scu.edu domain. Try again.");
      return;
    }
    
    e.newData.Position = e.newData.Position.trim();
    if(e.newData.Position !== "Admin" && e.newData.Position !== "Advisor"){
      alert("The position must be either 'Admin' or 'Advisor'. Try again.");
      return;
    }
    
    for(var i = 0; i < this.users.length; ++i){
      if(this.users[i].Email === e.newData.Email && this.users[i].UserID !== e.newData.UserID){
        alert("That email is in use. Refresh and try again.");
        return;
      }
    }
    
    if(e.data.Position === 'Admin' && e.newData.Position === 'Advisor'){
      var adminsLeft = 0;
      for(var i = 0; i < this.users.length && adminsLeft === 0; ++i){
        if(this.users[i].Position === 'Admin' && this.users[i].UserID !== e.data.UserID) ++adminsLeft;
      }
      if(adminsLeft === 0){
        alert("Making that edit would leave no admins left. Refresh and try again.");
        return;
      }
    }

    this.userService.editUser(e.newData)
    .then(http => {
      e.confirm.resolve(e.newData);
      console.log(this.users);

      //Update our permissions if we editted our own user
      if (e.newData.UserID === this.auth.UserID) {
        this.auth.logIn(e.newData);
      }
    });
  }
  
  delete(e: any){
    console.log('Delete', e.data);
    
    var adminsLeft = 0;
    for(var i = 0; i < this.users.length && adminsLeft === 0; ++i){
      if(this.users[i].Position === 'Admin' && this.users[i].UserID !== e.data.UserID) ++adminsLeft;
    }
    if(adminsLeft === 0){
      alert("Deleting that user would leave no admins left. Refresh and try again.");
      return;
    }
    
    this.userService.deleteUser(e.data)
    .then(http => {
      e.confirm.resolve(e.data);
      console.log(this.users);
      this.users = this.users.filter(user => 
        user.UserID !== e.data.UserID
      );

      //If we delete our own account then log us out
      if (this.auth.UserID === e.data.UserID) {
        this.auth.logOut();
      }
    });
  }
}
