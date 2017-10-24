import { Component, OnInit } from '@angular/core';
import { School } from './../models/school';
import { SchoolService } from './../services/schools';

@Component({
	selector: 'schools',
	template: `
		<h1>Schools</h1>
		<p>Each link should connect to foreign_courses/schoolName, how to?</p>
		<table>
			<tr>
				<th>Name</th>
			</tr>
			<tr *ngFor="let school of schools" (click)="onSelect(school)">
				<td>{{school.Name}} <a routerLink="../foreign_courses/{{school.Name}}">Courses</a></td>
			</tr>
	`,
	styles: [``]
})
export class SchoolComponent implements OnInit {
  schools: School[];

  constructor(private schoolService: SchoolService) { }

  ngOnInit(): void {
    this.schoolService.getSchools().then(schools =>
      this.schools = schools
    );
  }

  onSelect(school: School): void {
    console.log('Selected', school);
  }
}