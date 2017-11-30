import { Component, OnInit } from '@angular/core';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { School } from './../models/school';
import { SchoolService } from './../services/schools';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'schools',
	template: `
    <h2 align="center">Schools</h2>
		<ng2-smart-table
      [settings]="settings"
      [source]="source"
      (createConfirm)="add($event)"
      (editConfirm)="edit($event)"
      (deleteConfirm)="delete($event)"
    >
		</ng2-smart-table>
	`,
	styles: []
})
export class SchoolComponent implements OnInit {
  schools: School[];
  source: LocalDataSource;
  
  settings = {
    columns: {
      Name: { title: 'Name' }
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
  constructor(private schoolService: SchoolService,
              private auth: AuthService) { }

  ngOnInit(): void {
    this.schoolService.getSchools().then(schools => {
      this.schools = schools;
      this.source = new LocalDataSource(this.schools);
    });
    
    var isAdmin = this.auth.isAdmin();
    this.settings.actions.add = isAdmin;
    this.settings.actions.delete = isAdmin;
    this.settings.actions.edit = isAdmin;
  }
  
  add(e: any) {
    e.newData.Name = e.newData.Name.trim();
    if(e.newData.Name === ""){
      alert("School name cannot be empty. Try again.");
      return;
    }
    
    for(var i = 0; i < this.schools.length; ++i){
      if(this.schools[i].Name === e.newData.Name){
        alert("That school already exists. Refresh and try again.");
        return;
      }
    }
    
    this.schoolService.addSchool(e.newData)
    .then(http => {
      e.newData.SchoolID = http.stmt.lastID
      e.confirm.resolve(e.newData);
    });
  }
  
  edit(e: any){
    e.newData.Name = e.newData.Name.trim();
    if(e.newData.Name === ""){
      alert("School name cannot be empty. Try again.");
      return;
    }
    
    for(var i = 0; i < this.schools.length; ++i){
      if(this.schools[i].Name === e.newData.Name && this.schools[i].SchoolID !== e.newData.SchoolID){
        alert("That school already exists. Refresh and try again.");
        return;
      }
    }
    
    this.schoolService.editSchool(e.newData)
    .then(http => {
      e.confirm.resolve(e.newData);
    });
  }
  
  delete(e: any){
    this.schoolService.deleteSchool(e.data)
    .then(http => {
      e.confirm.resolve(e.data);
      this.schools = this.schools.filter(school => 
        school.SchoolID !== e.data.SchoolID
      );
    });
  }
}
