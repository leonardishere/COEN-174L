import { Component, OnInit } from '@angular/core';
import { LocalCourse2 } from './../models/local_course2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { LocalCourseService } from './../services/local_courses';
import { subscribeChanges, contains } from '../utils';

@Component({
  selector: 'local-courses',
  template: `
    <h1>Local Courses</h1>
	<button type="button" class="btn btn-success" (click)="openNewCourse(content2)">Add Course</button>
	<br>
	<p>This adds the course, but doesn't display it. Should we force a refresh or what?</p>
	<form>
		Course Name:
		<input #LocalCourse 
			type="text" 
			name="LocalCourseName" 
			placeholder="{{placeholders.LocalCourseName}}" (input)="changes.LocalCourseName.next(LocalCourse.value)"/>
	</form>
	<br>
	<p>This should filter courses. I tried to do it like you did in equiv_courses, but I realized the accordion doesnt use a LocalDataSource that you can filter.</p>
	
	
	<!-- Equivalency Modal -->
    <ng-template #content let-c="close" let-d="dismiss">
      <div class="modal-header">
		<h4 class="modal-title">{{dialogInputs.Mode}} Equivalency</h4>
			<button type="button" class="close" aria-label="Close" (click)="d('Cross click')">
			  <span aria-hidden="true">&times;</span>
			</button>
		  </div>
		  <div class="modal-body">
		SCU Course: {{dialogCourse.LocalCourseName}}<br/>
		<br/>
		Foreign Course:
		<hr/>
		<form>
		<div class="form-group">
			<label for="school">School:</label>
			<input id="school" name="school" type="text" [(ngModel)]="dialogInputs.SchoolName"/>
		</div>
		<div class="form-group">
			<label for="course">Course Title:</label>
			<input id="course" name="course" type="text" [(ngModel)]="dialogInputs.ForeignCourseName"/>
		</div>
		<div class="form-group">
			<label for="status">Status:</label>
			<input id="status" name="status" type="text" [(ngModel)]="dialogInputs.Status"/>
		</div>
		<div class="form-group">
			<label for="notes">Notes:</label>
			<textarea id="notes" name="notes" [(ngModel)]="dialogInputs.Notes"></textarea>
		</div>
		</form>
		  </div>
		  <div class="modal-footer">
		  <button type="button" class="btn btn-outline-dark" (click)="c(dialogInputs)">{{dialogInputs.Mode}}</button>
			  <button type="button" class="btn btn-outline-dark" (click)="c('Close')">Cancel</button>
		  </div>
    </ng-template>
	
	<!-- Course Modal -->
	<ng-template #content2 let-c="close" let-d="dismiss">
      <div class="modal-header">
		<h4 class="modal-title">{{dialogInputs2.Mode}} Course</h4>
			<button type="button" class="close" aria-label="Close" (click)="d('Cross click')">
			  <span aria-hidden="true">&times;</span>
			</button>
		  </div>
		  <div class="modal-body">
		<br/>
		<form>
			<div class="form-group">
				<label for="dept">Department:</label>
				<input id="dept" name="dept" type="text" [(ngModel)]="dialogInputs2.Dept"/>
			</div>
			<div class="form-group">
				<label for="courseNum">Number:</label>
				<input id="courseNum" name="courseNum" type="text" [(ngModel)]="dialogInputs2.CourseNum"/>
			</div>
			<div class="form-group">
				<label for="courseTitle">Title:</label>
				<input id="courseTitle" name="courseTitle" type="text" [(ngModel)]="dialogInputs2.CourseTitle"/>
			</div>
		</form>
		  </div>
		  <div class="modal-footer">
		  <button type="button" class="btn btn-outline-dark" (click)="c(dialogInputs2)">{{dialogInputs2.Mode}}</button>
		  <button type="button" class="btn btn-outline-dark" (click)="c('Close')">Cancel</button>
		  </div>
    </ng-template>
	
	<!-- Courses Accordion -->
    <ngb-accordion #acc="ngbAccordion">
        <ngb-panel *ngFor="let course of courses" title="{{course.LocalCourseName}}">
			<!-- Figure out how to put this into the header bar
			<div *ngIf="course.ForeignCourses.length <= 0">
				No equivalent courses
			</div>
			-->
	    	<ng-template ngbPanelContent>
				<button class="btn btn-success" (click)="open(content, course)">Add Equivalency</button>
				<div *ngIf="course.ForeignCourses.length <= 0">
					No equivalent courses
				</div>
				<table *ngIf="course.ForeignCourses.length > 0">
					<tr>
						<th>Foreign Course</th>
						<th>School</th>
						<th>Status</th>
						<th></th>
					</tr>
					<tr *ngFor="let foreignCourse of course.ForeignCourses">
						<td>{{foreignCourse.ForeignCourseName}}</td>
						<td>{{foreignCourse.SchoolName}}</td>
						<td>{{foreignCourse.Status}}</td>
						<td>
							<i class="fa fa-pencil-square-o" aria-hidden="true" (click)="edit(content, course, foreignCourse)"></i>
							<i class="fa fa-trash-o" aria-hidden="true" (click)="delete(course, foreignCourse)"></i>
						</td>
					</tr>
				</table>
			</ng-template>
	    </ngb-panel>
    </ngb-accordion>
  `,
  styles: [`
    table { width: 100%; }
  `]
})
export class LocalCoursesComponent implements OnInit {
  courses: LocalCourse2[];
  source: LocalDataSource;
  placeholders = {
    LocalCourseName: "COEN 210 - Computer Architecture"
  };
  changes = {
    LocalCourseName: new Subject<string>()
  };
  dialogCourse: LocalCourse2;
  dialogInputs = {
	  Mode: "Add Equivalency",
	  SchoolName: "",
	  ForeignCourseName: "",
	  Status: "",
	  Notes: ""
  }
  dialogInputs2 = {
	  Mode: "Add Course",
	  Dept: "",
	  CourseNum: "",
	  CourseTitle: ""
  }
  settings = {
    columns: {
      LocalCourseName: { title: 'Local Course' },
      ForeignCourseName: { title: 'Foreign Course' },
      SchoolName: { title: 'School' },
      Status: { title: 'Status' }
    },
    pager: {
      perPage: 100
    }
  };

  constructor(private localCourseService: LocalCourseService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.localCourseService.getLocalCourses().then(courses => {
      this.courses = courses;
	  this.source = new LocalDataSource(this.courses);
    });
  
  subscribeChanges(this.changes.LocalCourseName, (search) => {
      this.source.addFilter({field: 'LocalCourseName', search: search});
    });
  }

  onSelect(course: LocalCourse2): void {
    console.log('Selected', course);
  }

  open(content, course) {
    this.dialogInputs.Mode = "Add";
    this.dialogCourse = course;
    this.modalService.open(content).result.then((result) => {
      course.ForeignCourses.push(result);
      console.log(course);
      result.LocalCourseID = course.LocalCourseID;
      console.log(result);
      this.localCourseService.addEquivCourse(result);
    });
  }

  edit(content, course, foreignCourse) {
    this.dialogInputs.Mode = "Edit";
    this.dialogCourse = course;
    this.dialogInputs = foreignCourse;
    this.modalService.open(content).result.then((result) => {
      let i = course.ForeignCourses.find(fc => fc.ForeignCourseName === foreignCourse.ForeignCourseName);
      course.ForeignCourses[i] = result;
      result.LocalCourseID = course.LocalCourseID;
      console.log(result);
      this.localCourseService.editEquivCourse(result);
    });
  }

  delete(course, foreignCourse) {
    course.ForeignCourses = course.ForeignCourses.filter(fc =>
	    fc.ForeignCourseName !== foreignCourse.ForeignCourseName
    );
    foreignCourse.LocalCourseID = course.LocalCourseID;
    this.localCourseService.deleteEquivCourse(foreignCourse);
  }
  
  openNewCourse(content2){
	  this.dialogInputs2.Mode = "Add";
	  this.modalService.open(content2).result.then((result) => {
		  //console.log("New Course");
		  //console.log(result);
		  console.log(result.Dept + " " + result.CourseNum + " - " + result.CourseTitle);
		  if(result.Dept == null || result.CourseNum == null || result.courseTitle == null){
			  console.log("null check, don't add");
		  }else{
			this.localCourseService.addLocalCourse(result);
		  }
	  });
  }
}
