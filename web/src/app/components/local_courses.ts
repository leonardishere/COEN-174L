import { Component, OnInit } from '@angular/core';
import { LocalCourseJoined } from './../models/local_course_joined';
import { LocalCourseService } from './../services/local_courses';

@Component({
	selector: 'local-courses',
	template: `
		<h1>Local Courses</h1>
		<p>if someone could redo this template to make it look like http://localhost:3000/local_courses but better that would be sweet</p>
		<table>
			<tr>
				<th>Local Course Name</th>
				<th>Foreign Course Name</th>
				<th>School</th>
				<th>Status</th>
			</tr>
			<tr *ngFor="let course of courses" (click)="onSelect(course)">
				<td>{{course.LocalCourseName}}</td>
				<td>{{course.ForeignCourseName}}</td>
				<td>{{course.SchoolName}}</td>
				<td>{{course.Status}}</td>
	`,
	styles: [``]
})
export class LocalCoursesComponent implements OnInit {
  courses: LocalCourseJoined[];

  constructor(private localCourseService: LocalCourseService) { }

  ngOnInit(): void {
    this.localCourseService.getLocalCourses().then(courses =>
      this.courses = courses
    );
  }

  onSelect(course: LocalCourseJoined): void {
    console.log('Selected', course);
  }
}