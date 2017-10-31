import { Component, OnInit } from '@angular/core';
import { LocalCourse2 } from './../models/local_course2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { LocalCourseService } from './../services/local_courses';

@Component({
  selector: 'local-courses',
  template: `
    <h1>Local Courses</h1>
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
    <ngb-accordion #acc="ngbAccordion">
        <ngb-panel *ngFor="let course of courses" title="{{course.LocalCourseName}}">
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
  dialogCourse: LocalCourse2;
  dialogInputs = {
	  Mode: "Add Equivalency",
	  SchoolName: "",
	  ForeignCourseName: "",
	  Status: "",
	  Notes: ""
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
      console.log(result);
    });
  }

  edit(content, course, foreignCourse) {
    this.dialogInputs.Mode = "Edit";
    this.dialogCourse = course;
    this.dialogInputs = foreignCourse;
    this.modalService.open(content).result.then((result) => {
      let i = course.ForeignCourses.find(fc => fc.ForeignCourseName === foreignCourse.ForeignCourseName);
      course.ForeignCourses[i] = result;
      console.log(result);
    });
  }

  delete(course, foreignCourse) {
    this.dialogCourse = course;
    this.dialogInputs = foreignCourse;
    course.ForeignCourses = course.ForeignCourses.filter(fc =>
	    fc.ForeignCourseName !== foreignCourse.ForeignCourseName
    );
  }
}
