import { Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { EquivCourseJoined } from '../models/equiv_course_joined';
import { EquivCourseService } from './../services/equiv_courses';
import { subscribeChanges, contains } from '../utils';

@Component({
selector: 'equiv-courses',
  template: `
	<h1>Equivalent Courses</h1>
	<form>
		Local Course:<br>
    <input #LocalCourse
      type="text"
      name="LocalCourseName"
      placeholder="{{placeholders.LocalCourseName}}"
      (input)="changes.LocalCourseName.next(LocalCourse.value)">
		<br>
		School Name:<br>
    <input #School
      type="text"
      name="SchoolName"
      placeholder="{{placeholders.SchoolName}}"
      (input)="changes.SchoolName.next(School.value)">
		<br>
		Foreign Course:<br>
    <input #ForeignCourse
      id="ForeignCourseNameBox"
      type="text"
      name="ForeignCourseName"
      placeholder="{{placeholders.ForeignCourseName}}"
      (input)="changes.ForeignCourseName.next(ForeignCourse.value)">
		<br><br>
	</form>
	<table>
		<tr>
			<th>Local Course Name</th>
			<th>Foreign Course Name</th>
			<th>School</th>
			<th>Status</th>
		</tr>
		<tr *ngFor="let course of courses"
			(click)="onSelect(course)" >
			<td>{{course.LocalCourseName}}</td>
			<td>{{course.ForeignCourseName}}</td>
			<td>{{course.SchoolName}}</td>
			<td>{{course.Status}}</td>
		</tr>
	</table>
  `,
  styles: [`
    input {
      width: 500px;
    }
  `]
})
export class EquivCoursesComponent {
  courses: EquivCourseJoined[];
  all_courses: EquivCourseJoined[];
  placeholders = {
    LocalCourseName: "COEN 210 - Computer Architecture",
    SchoolName: "San Jose State University",
    ForeignCourseName: "CMPE 200 - Computer Architecture"
  };
  search = {
    LocalCourseName: '',
    SchoolName: '',
    ForeignCourseName: ''
  };
  changes = {
    LocalCourseName: new Subject<string>(),
    SchoolName: new Subject<string>(),
    ForeignCourseName: new Subject<string>()
  };

  constructor(private equivCourseService: EquivCourseService) { }

  ngOnInit(): void {
	  this.equivCourseService.getEquivCourses().then(courses => {
	    this.all_courses = courses;
	    this.courses = courses;
    });

    subscribeChanges(this.changes.LocalCourseName, (search) => {
      this.search.LocalCourseName = search;
      this.filterCourses();
    });
    subscribeChanges(this.changes.SchoolName, (search) => {
      this.search.SchoolName = search
      this.filterCourses();
    });
    subscribeChanges(this.changes.ForeignCourseName, (search) => {
      this.search.ForeignCourseName = search
      this.filterCourses();
    });
  }

  filterCourses(): void {
    this.courses = this.all_courses.filter(course =>
      contains(course.LocalCourseName, this.search.LocalCourseName) &&
      contains(course.SchoolName, this.search.SchoolName) &&
      contains(course.ForeignCourseName, this.search.ForeignCourseName)
    );
  }

  onSelect(course: EquivCourseJoined): void {
    console.log('Selected', course);
  }
}
