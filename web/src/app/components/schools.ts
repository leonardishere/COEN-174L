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
		[source]="source">
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
    }
  };
  constructor(private schoolService: SchoolService) { }

  ngOnInit(): void {
    this.schoolService.getSchools().then(schools => {
      this.schools = schools;
	  console.log(this.schools);
	  this.source = new LocalDataSource(this.schools);
    });
  }

  onSelect(school: School): void {
    console.log('Selected', school);
  }
}