import { Component, OnInit } from '@angular/core';
import { ForeignCourseJoined } from './../models/foreign_course_joined';
import { ForeignCourseService } from './../services/foreign_courses';

@Component({
	selector: 'foreign-courses',
	template: `
		<h1>Foreign Courses</h1>
		<p>if someone could redo this template to make it look like http://localhost:3000/foreign_courses but better that would be sweet</p>
		<table>
			<tr>
				<th>Foreign Course Name</th>
				<th>School</th>
				<th>Local Course Name</th>
				<th>Status</th>
			</tr>
			<tr *ngFor="let course of courses" (click)="onSelect(course)">
				<td>{{course.ForeignCourseName}}</td>
				<td>{{course.SchoolName}}</td>
				<td>{{course.LocalCourseName}}</td>
				<td>{{course.Status}}</td>
	`,
	styles: [``]
})
export class ForeignCourseComponent implements OnInit {
  courses: ForeignCourseJoined[];

  constructor(private foreignCourseService: ForeignCourseService) { }

  ngOnInit(): void {
    this.foreignCourseService.getForeignCourses().then(courses =>
      this.courses = courses
    );
  }

  onSelect(course: ForeignCourseJoined): void {
    console.log('Selected', course);
  }
}