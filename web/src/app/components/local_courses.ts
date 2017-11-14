import { Component, OnInit } from '@angular/core';
import { LocalCourse2 } from './../models/local_course2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { LocalCourseService } from './../services/local_courses';
import { subscribeChanges, contains } from '../utils';

//import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { School } from './../models/school';

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
          <ng-template #rt let-r="result" let-t="term">
            <p (click)="selectSchool(r.Name)">{{r.Name}}</p>
          </ng-template>
          <label for="typeahead-basic1">School:</label>
          <input id="typeahead-basic1" type="text" class="form-control" [(ngModel)]="dialogInputs.SchoolName" [ngbTypeahead]="search1" [ngModelOptions]="{standalone: true}" [resultTemplate]="rt" [inputFormatter]="formatter1" (blur)="selectSchool(dialogInputs.SchoolName)"/>
        </div>
        <div class="form-group">
          <label for="course">Course Title:</label>
          <input id="typeahead-basic2" type="text" class="form-control" [(ngModel)]="dialogInputs.ForeignCourseName" [ngbTypeahead]="search2" [ngModelOptions]="{standalone: true}"/>
        </div>
        <div class="form-group">
          <label for="status">Status:</label>
          <input id="typeahead-basic3" type="text" class="form-control" [(ngModel)]="dialogInputs.Status" [ngbTypeahead]="search3" [ngModelOptions]="{standalone: true}"/>
        </div>
        <div class="form-group">
          <label for="lock">Lock future modification?:</label>
          <input id="lock" name="lock" type="checkbox" [(ngModel)]="dialogInputs.Lock"/>
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
            <th>Locked By</th>
            <th>Notes</th>
						<th></th>
					</tr>
					<tr *ngFor="let foreignCourse of course.ForeignCourses">
						<td>{{foreignCourse.ForeignCourseName}}</td>
						<td>{{foreignCourse.SchoolName}}</td>
						<td>{{foreignCourse.Status}}</td>
            <td>{{foreignCourse.LockedByUser}}</td>
            <td>{{foreignCourse.Notes}}</td>
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
  //schools: string[]; //should be school[]
  schools: School[];
  foreignCourses: string[]; //should be foreignCourse[]
  //foreignCourses: ForeignCourse[];
  //foreignCourses: any[];
  statuses: string[];
  
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
    Lock: "",
	  Notes: ""
  }
  dialogOutputs = {
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
    
    //this.schools = new Array<string>();
    this.localCourseService.getSchools().then(schools => {
      this.schools = schools;
      //schools.forEach(school => {this.schools.push(school.Name);});
      //console.log(schools);
    });
    
    this.foreignCourses = new Array<string>();
    this.localCourseService.getForeignCourses().then(foreignCourses => {
      //this.foreignCourses = foreignCourses;
      foreignCourses.forEach(foreignCourse => {this.foreignCourses.push(foreignCourse.ForeignCourseName);});
      //console.log(this.foreignCourses);
    });
    
    this.statuses = new Array<string>();
    this.statuses.push("Accepted");
    this.statuses.push("Rejected");
  }

  onSelect(course: LocalCourse2): void {
    console.log('Selected', course);
  }
  
  //equivalency typeahead
  search1 = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : this.schools.filter(v => v.Name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
  
  formatter1 = (x: {Name: string}) => x.Name;
  
  selectSchool(school){
    /*
    if(school.Name == null){
      console.log("school: " + school);
      this.dialogOutputs.SchoolName = school;
    }else{
      console.log("school: " + school.Name);
      this.dialogOutputs.SchoolName = school.Name;
    }
    */
  }
        
  search2 = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : this.foreignCourses.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
        
  search3 = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 0 ? []
        : this.statuses.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  //open equivalency modal
  open(content, course) {
    this.dialogInputs.Mode = "Add";
    this.dialogCourse = course;
    this.modalService.open(content).result.then((result) => {
      course.ForeignCourses.push(result);
      console.log(course);
      result.LocalCourseID = course.LocalCourseID;
      
      console.log(result);
      console.log(result.SchoolName);      
      
      if(result === "Close"){
        console.log("Closed, don't add");
      }else{
        if(result.Mode == null || result.SchoolName == null || result.ForeignCourseName == null || result.Status == null || result.Lock == null || result.Notes == null){
          console.log("null check, don't add");
        }else{
          var result2 = result;
          if(result.SchoolName.Name == null){
            console.log("school: " + result.SchoolName);
          }else{
            console.log("school: " + result.SchoolName.Name);
            result2.SchoolName = result.SchoolName.Name;
          }
          if(result.Mode === "" || result2.SchoolName === "" || result.ForeignCourseName === "" || result.Status === ""){
            console.log("empty check, don't add");
          }else{
            /* // the schools router for this is broken for now, will fix later
            var schools;
            this.localCourseService.getSchool(result2.SchoolName).then(schools2 => {schools = schools2;});
            console.log(schools);
            if(schools.length != 1){
              console.log("School \"" + result2.SchoolName + "\" does not exist. Enter a valid school.");
            */
            if(false){
            }else{
              if(result.Lock){
                //get current user's userid, shove it into result2.LockedBy
                result2.LockedBy = 0;
              }else{
                result2.LockedBy = null;
              }
              console.log(result2);
              this.localCourseService.addEquivCourse(result2);
            }
          }
        }
      }
      /*
      result.Mode = "";
      result.SchoolName = "";
      result.ForeignCourseName = "";
      result.Status = "";
      result.Lock = false;
      result.Notes = "";
      */
    });
  }

  //edit equivalency
  edit(content, course, foreignCourse) {
    //check if user has permission
    var currentUserID = 0; //get these
    var currentUserName = "Andrew Leonard";
    var currentUserPosition = "not an admin";
    if(foreignCourse.LockedBy != null && foreignCourse.LockedBy !== currentUserID && currentUserPosition !== "Admin"){
      alert("You don't have permission to edit this equivalency. Consult " + foreignCourse.LockedByUser + " or an Admin to edit it. (This demo assumes you're Andrew Leonard.)");
      return;
    }
    
    this.dialogInputs.Mode = "Edit";
    this.dialogCourse = course;
    this.dialogInputs = foreignCourse;
    this.modalService.open(content).result.then((result) => {
      let i = course.ForeignCourses.find(fc => fc.ForeignCourseName === foreignCourse.ForeignCourseName);
      course.ForeignCourses[i] = result;
      result.LocalCourseID = course.LocalCourseID;
      console.log(""+result.SchoolName);
      console.log(this.dialogInputs.SchoolName);
      console.log(this.dialogOutputs.SchoolName);
      console.log(result);
      result.SchoolName = this.dialogOutputs.SchoolName;
      console.log(result);
      this.localCourseService.editEquivCourse(result);
      
      
      result.Mode = "";
      result.SchoolName = "";
      result.ForeignCourseName = "";
      result.Status = "";
      result.Lock = false;
      result.Notes = "";
    });
  }

  //delete equivalency
  delete(course, foreignCourse) {
    course.ForeignCourses = course.ForeignCourses.filter(fc =>
	    fc.ForeignCourseName !== foreignCourse.ForeignCourseName
    );
    foreignCourse.LocalCourseID = course.LocalCourseID;
    this.localCourseService.deleteEquivCourse(foreignCourse);
  }
  
  //add new course
  openNewCourse(content2){
	  this.dialogInputs2.Mode = "Add";
	  this.modalService.open(content2).result.then((result) => {
		  //console.log("New Course");
		  //console.log(result);
      if(result === "Close"){
        console.log("Closed, don't add");
      }else{
        console.log(result.Dept + " " + result.CourseNum + " - " + result.CourseTitle);
        if(result.Dept == null || result.CourseNum == null || result.CourseTitle == null){
          console.log("null check, don't add");
        }else{
          result.Dept = result.Dept.trim();
          result.CourseNum = result.CourseNum.trim();
          result.CourseTitle = result.CourseTitle.trim();
          console.log(result.Dept + " " + result.CourseNum + " - " + result.CourseTitle);
          if(result.Dept === "" || result.CourseNum === "" || result.CourseTitle === ""){
            console.log("empty check, don't add");
          }else{
            this.localCourseService.addLocalCourse(result);
            //this.courses.push(result); //doesnt actually do anything. how do we get the new course to appear?
          }
        }
      }
	  });
  }
}
