import { Component, OnInit } from '@angular/core';
import { LocalCourse2 } from './../models/local_course2';
import { LocalCourseService } from './../services/local_courses';

@Component({
	selector: 'local-courses',
	template: `
	<h1>Local Courses</h1>
	<table>
		<tr>
			<th>Local Course</th>
			<th>Foreign Courses</th>
		</tr>
		<tr *ngFor="let course of courses" (click)="onSelect(course)">
			<td>{{course.LocalCourseName}}</td>
			<td>
				<table>
					<tr>
						<th>Foreign Course</th>
						<th>School</th>
						<th>Status</th>
					</tr>
					<tr *ngFor="let foreignCourse of course.ForeignCourses">
						<td>{{foreignCourse.ForeignCourseName}}</td>
						<td>{{foreignCourse.SchoolName}}</td>
						<td>{{foreignCourse.Status}}</td>
					</tr>
				</table>
			</td>
		</tr>
	`,
	styles: [``]
})
export class LocalCoursesComponent implements OnInit {
  courses: LocalCourse2[];

  constructor(private localCourseService: LocalCourseService) { }

  ngOnInit(): void {
    this.localCourseService.getLocalCourses().then(courses =>
      this.courses = courses
    );
  }

  onSelect(course: LocalCourse2): void {
    console.log('Selected', course);
  }
}