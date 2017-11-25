import { Component, OnInit } from '@angular/core';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { School } from './../models/school';
import { SchoolService } from './../services/schools';

@Component({
	selector: 'schools',
	template: `
		<h1>Schools</h1>
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
  constructor(private schoolService: SchoolService) { }

  ngOnInit(): void {
    this.schoolService.getSchools().then(schools => {
      this.schools = schools;
      this.source = new LocalDataSource(this.schools);
    });
    
    var currentUserID = 0; //TODO: retrieve user
    var currentUserName = "Andrew Leonard";
    var currentUserPosition = "Admin";//"not an admin";
    
    var isAdmin = currentUserPosition === "Admin";
    this.settings.actions.add = isAdmin;
    this.settings.actions.delete = isAdmin;
    this.settings.actions.edit = isAdmin;
  }

  onSelect(school: School): void {
    console.log('Selected', school);
  }
  
  add(e: any) {
    console.log('Add', e.newData);
    
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
      //console.log(http);
      e.newData.SchoolID = http.stmt.lastID;
      //console.log(e.newData);
      e.confirm.resolve(e.newData);
      console.log(this.schools);
    });
  }
  
  edit(e: any){
    console.log('Edit', e.newData);
    
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
      console.log(http);
      //e.newData.SchoolID = http.stmt.lastID;
      //console.log(e.newData);
      e.confirm.resolve(e.newData);
      console.log(this.schools);
    });
  }
  
  delete(e: any){
    console.log('Delete', e.data);
    
    this.schoolService.deleteSchool(e.data)
    .then(http => {
      console.log(http);
      e.confirm.resolve(e.data);
      this.schools = this.schools.filter(school => 
        school.SchoolID !== e.data.SchoolID
      );
      console.log(this.schools);
    });
  }
}