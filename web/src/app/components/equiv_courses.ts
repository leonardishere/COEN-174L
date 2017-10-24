import { Component, OnInit } from '@angular/core';
import { EquivCourseJoined } from './../models/equiv_course_joined';
import { EquivCourseService } from './../services/equiv_courses';

@Component({
selector: 'equiv-courses',
  template: `
	<style>
		input {
			width: 500px;
		}
	</style>
	<script src="https://code.jquery.com/jquery-1.10.2.js"></script>
	<script>
		function formChangeLocalCourse(){
			var str = document.getElementById("LocalCourseNameBox").value;
			console.log(str);
		}
	</script>
	
	<h1>Equivalent Courses</h1>
	<p>I have some a script set up that detects changes to the form. Angular keeps trimming all my scripts out. How we do we get around that?</p>
	<p>Refer to web/test/test2.html to see how the scripts should work.</p>
	<br>
	<form>
		Local Course:<br>
		<input id="LocalCourseNameBox" type="text" name="LocalCourseName" placeholder="COEN 210 - Computer Architecture" oninput="formChangeLocalCourse();">
		<br>
		School Name:<br>
		<input id="SchoolNameBox" type="text" name="SchoolName" placeholder="San Jose State University">
		<br>
		Foreign Course:<br>
		<input id="ForeignCourseNameBox" type="text" name="ForeignCourseName" placeholder="CMPE 200 - Computer Architecture">
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