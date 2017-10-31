import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
//import { ForeignCourseJoined } from './../models/foreign_course_joined';
import { ForeignCourse3 } from './../models/foreign_course3';
import { ForeignCourseService } from './../services/foreign_courses';

@Component({
	selector: 'foreign-courses',
	template: `
		<h1>Foreign Courses</h1>
		<ng-template #content let-c="close" let-d="dismiss">
		  <div class="modal-header">
		<h4 class="modal-title">{{dialogInputs.Mode}} Equivalency</h4>
			<button type="button" class="close" aria-label="Close" (click)="d('Cross click')">
			  <span aria-hidden="true">&times;</span>
			</button>
		  </div>
		  <div class="modal-body">
		Foreign Course: {{dialogCourse.ForeignCourseName}}<br/>
		School: {{dialogCourse.SchoolName}}<br/>
		<br/>
		SCU Course:
		<hr/>
		<form>
		<div class="form-group">
			<label for="course">Course Title:</label>
			<input id="course" name="course" type="text" [(ngModel)]="dialogInputs.LocalCourseName"/>
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
		<ngb-accordion #acc="ngbAccordion">
        <ngb-panel *ngFor="let course of courses" title="{{course.ForeignCourseName}}">
	    	<ng-template ngbPanelContent>
		<button class="btn btn-success" (click)="open(content, course)">Add Equivalency</button>
		<div *ngIf="course.LocalCourses.length <= 0">
			No equivalent courses
		</div>
		<table *ngIf="course.LocalCourses.length > 0">
			<tr>
				<th>Local Course</th>
				<th>Status</th>
				<th></th>
			</tr>
			<tr *ngFor="let localCourse of course.LocalCourses">
				<td>{{localCourse.LocalCourseName}}</td>
				<td>{{localCourse.Status}}</td>
				<td>
					<i class="fa fa-pencil-square-o" aria-hidden="true" (click)="edit(content, course, localCourse)"></i>
					<i class="fa fa-trash-o" aria-hidden="true" (click)="delete(course, localCourse)"></i>
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
export class ForeignCourseComponent implements OnInit {
  courses: ForeignCourse3[];
  dialogCourse: ForeignCourse3;
  dialogInputs = {
	  Mode: "Add Equivalency",
	  LocalCourseName: "",
	  Status: "",
	  Notes: ""
  }
	source: LocalDataSource;
	settings = {
    columns: {
      ForeignCourseName: { title: 'Foreign Course' },
      SchoolName: { title: 'School' },
      LocalCourseName: { title: 'Local Course' },
			Status: { title: 'Status' }
    },
		pager: {
			perPage: 100
		}
  };
  constructor(private foreignCourseService: ForeignCourseService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.foreignCourseService.getForeignCourses().then(courses => {
      this.courses = courses;
			this.source = new LocalDataSource(this.courses);
    });
  }

  onSelect(course: ForeignCourse3): void {
    console.log('Selected', course);
  }
  
  open(content, course) {
    this.dialogInputs.Mode = "Add";
    this.dialogCourse = course;
    this.modalService.open(content).result.then((result) => {
      course.LocalCourses.push(result);
      console.log(result);
    });
  }

  edit(content, course, localCourse) {
    this.dialogInputs.Mode = "Edit";
    this.dialogCourse = course;
    this.dialogInputs = localCourse;
    this.modalService.open(content).result.then((result) => {
      let i = course.LocalCourses.find(fc => fc.LocalCourseName === localCourse.LocalCourseName);
      course.LocalCourses[i] = result;
      console.log(result);
    });
  }

  delete(course, localCourse) {
    this.dialogCourse = course;
    this.dialogInputs = localCourse;
    course.LocalCourses = course.LocalCourses.filter(fc =>
	    fc.LocalCourseName !== localCourse.LocalCourseName
    );
  }
}
