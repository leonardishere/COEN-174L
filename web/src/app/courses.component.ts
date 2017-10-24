import { Component, OnInit } from '@angular/core';

import { LocalCourse } from './models/local_course';
import { EquivCourseJoined } from './models/equiv_course_joined';
import { LocalCourseJoined } from './models/local_course_joined';
import { User } from './models/users';
import { ChangeJoined } from './models/change_joined';

import { CourseService } from './course.service';
import { EquivCourseService } from './course.service';
import { LocalCourseService } from './course.service';
import { UserService } from './course.service';
import { ChangeService } from './course.service';

/* CoursesComponent */
@Component({
selector: 'local-courses',
  template: `
  <h1>Courses </h1>
  <ul>
    <li *ngFor="let course of courses"
      (click)="onSelect(course)">
      <span>{{course.Department}}</span>
      <span>{{course.CourseNum}}</span>:
      <span>{{course.Title}}</span>
    </li>
  </ul>
  `,
  styles: [``]
})
export class CoursesComponent implements OnInit {
  courses: LocalCourse[];

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.courseService.getLocalCourses().then(courses =>
      this.courses = courses
    );
  }

  onSelect(course: LocalCourse): void {
    console.log('Selected', course);
  }
}

/* LocalCoursesComponent */
@Component({
selector: 'equiv-courses',
  template: `
	<script src="https://code.jquery.com/jquery-1.10.2.js"></script>
	<script>
		function formChangeLocalCourse(){
			var str = document.getElementById("LocalCourseNameBox").value;
			console.log(str);
		}
	</script>
	
	<h1>Equivalent Courses</h1>
	<p>I have some a script set up that detects changes to the form. Angular keeps trimming all my scripts out. How we do we get around that?</p>
	<br>
	<form>
		Local Course:<br>
		<input id="LocalCourseNameBox" type="text" name="LocalCourseName" value="COEN 210 - Computer Architecture" oninput="formChangeLocalCourse();">
		<br>
		School Name:<br>
		<input id="SchoolNameBox" type="text" name="SchoolName" value="San Jose State University" ng-model="schoolName">
		<br>
		Foreign Course:<br>
		<input id="ForeignCourseNameBox" type="text" name="ForeignCourseName" value="CMPE 200 - Computer Architecture">
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
	<script>
		console.log($("LocalCouseNameBox").value);
		console.log("cmon man give me a sign");
		//document.getElementById("LocalCourseNameBox")
		$("LocalCouseNameBox")
			.change(function () {
				var str = document.getElementById("LocalCourseNameBox").value;
				//$( "div" ).text( str );
				console.log(str);
				console.log("change detected");
			})
			//.change();
	</script>
  `,
  styles: [``]
})
export class EquivCoursesComponent implements OnInit {
  courses: EquivCourseJoined[];

  constructor(private equivCourseService: EquivCourseService) { }

  ngOnInit(): void {
    this.equivCourseService.getEquivCourses().then(courses =>
      this.courses = courses
    );
  }
  
	ngAfterViewInit() {
		var s = document.createElement("script");
		s.type = "text/javascript";
		s.innerHTML="console.log('done');"; //inline script
		s.src = '../../web/node-modules/andrews-custom-scripts/formChangeLocalCourse.ts';
		console.log('loaded');
		document.body.appendChild(s);
	}

  onSelect(course: EquivCourseJoined): void {
    console.log('Selected', course);
  }
}

/* LocalCoursesComponent */
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

/* UsersComponent */
@Component({
	selector: 'users',
	template: `
		<h1>Users</h1>
		<table>
			<tr>
				<th>User Name</th>
				<th>Email</th>
				<th>Position</th>
			</tr>
			<tr *ngFor="let user of users" (click)="onSelect(user)">
				<td>{{user.Name}}</td>
				<td>{{user.Email}}</td>
				<td>{{user.Position}}</td>
	`,
	styles: [``]
})
export class UserComponent implements OnInit {
  users: User[];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().then(users =>
      this.users = users
    );
  }

  onSelect(user: User): void {
    console.log('Selected', user);
  }
}

/* ChangeComponent */
@Component({
	selector: 'change',
	template: `
		<h1>Changes</h1>
		<table>
			<tr>
				<th>Local Course</th>
				<th>Foreign Course</th>
				<th>School</th>
				<th>Status</th>
				<th>Notes</th>
				<th>Date</th>
				<th>User Name</th>
				<th>User Email</th>
			</tr>
			<tr *ngFor="let change of changes" (click)="onSelect(change)">
				<td>{{change.LocalCourseName}}</td>
				<td>{{change.ForeignCourseName}}</td>
				<td>{{change.SchoolName}}</td>
				<td>{{change.NewStatus}}</td>
				<td>{{change.Notes}}</td>
				<td>{{change.Date}}</td>
				<td>{{change.UserName}}</td>
				<td>{{change.UserEmail}}</td>
	`,
	styles: [``]
})
export class ChangeComponent implements OnInit {
  changes: ChangeJoined[];

  constructor(private changeService: ChangeService) { }

  ngOnInit(): void {
    this.changeService.getChanges().then(changes =>
      this.changes = changes
    );
  }

  onSelect(change: ChangeJoined): void {
    console.log('Selected', change);
  }
}