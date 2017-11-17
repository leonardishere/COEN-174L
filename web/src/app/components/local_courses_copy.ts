import { Component, OnInit, Input, Output, EventEmitter, NgModule } from '@angular/core';
import { LocalCourse2 } from './../models/local_course2';
import { ForeignCourse2 } from './../models/foreign_course2';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import { Ng2SmartTableModule, LocalDataSource, ViewCell } from 'ng2-smart-table';
import { LocalCourseService } from './../services/local_courses';
import { subscribeChanges, contains } from '../utils';

//import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { School } from './../models/school';
import { LocalCoursePlain } from './../models/local_course_plain';
//import { ViewCell } from '../../../../ng2-smart-table';

//these werent required earlier
import { NgbAccordion, NgbPanel } from '@ng-bootstrap/ng-bootstrap/accordion/accordion';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion/accordion.module';
import { AccordionViewComponent } from './local_courses_accordion';
 
//custom accordion component
/*
@Component({
  selector: 'accordion-view',
  template: `
    <!--
    <ngb-accordion>
      <ngb-panel title="{{course.LocalCourseName}}">
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
          <p>Open</p>
        </ng-template>
	    </ngb-panel>
    </ngb-accordion>
    -->
    <!--<p>{{course.LocalCourseName}}</p>-->
    
    
    <p>{{course}}</p>
    
    
    <ngb-accordion>
      <ngb-panel title="{{course}}">
        <ng-template ngbPanelContent>
          <p>{{course}}</p>
        </ng-template>
      </ngb-panel>
    </ngb-accordion>
    
  `,
  styles: [`
    table { width: 100%; }
  `]
})
class AccordionViewComponent implements ViewCell, OnInit {
  @Input() rowData: any;
  /*
  course: LocalCourse2;

  @Input() value: LocalCourse2;

  ngOnInit() {
    this.course = this.value;
  }
  
  
  course: string;
  @Input() value: string;
  ngOnInit(){
    this.course = this.value;
  }
}
*/
/*
@NgModule({
  imports: [NgbModule.forRoot(), NgbAccordion, NgbPanel, NgbAccordionModule], 
  declarations: [NgbAccordion, NgbPanel, NgbAccordionModule, AccordionViewComponent],
  bootstrap: [AccordionViewComponent]
}) 
*/

//main component
@Component({
  selector: 'local-courses',
  template: `
    <h1>Local Courses</h1>
    <button type="button" class="btn btn-success" (click)="addCourse(content2)">Add Course</button>
    <br><br>
    <form>
      <div class="form-group">
        <ng-template #rtLocalCourse let-r="result" let-t="term">
          <p>{{r.LocalCourseName}}</p>
        </ng-template>
        <label for="typeahead-LocalCourse">Local Course:</label>
        <input #LocalCourse id="typeahead-LocalCourse" type="text" class="form-control" [ngbTypeahead]="searchLocalCourse" [resultTemplate]="rtLocalCourse" [inputFormatter]="formatterLocalCourse" (input)="changes.LocalCourseName.next(LocalCourse.value)" (selectItem)="changes.LocalCourseName.next($event.item.LocalCourseName)" placeholder="{{placeholders.LocalCourseName}}" [placement]="['bottom-left']"/>
      </div>
    </form>
    <p>I got the course filtering to work by shoving the entire thing into a ng2 smart table. I'll work on restoring functionality soon. The css changed a little but not by much.</p>
	
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
    <!--
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
    -->
    
    <!-- table -->
    
    <ng2-smart-table
      [settings]="settings"
      [source]="source">
    </ng2-smart-table>
    
  `,
  styles: [`
    table { width: 100%; }
  `],
  entryComponents: [AccordionViewComponent]
})
@NgModule({
  imports: [ AccordionViewComponent ],
  entryComponents: [ AccordionViewComponent ]
})
export class LocalCoursesComponent implements OnInit {
  schools: School[];
  foreignCourses: string[]; //should be foreignCourse[]
  //foreignCourses: ForeignCourse[];
  //foreignCourses: any[];
  statuses: string[];
  localCourses: LocalCoursePlain[];
  currentLocalCourseSearch: string;
  
  courses: LocalCourse2[];
  //courses: LocalCourse2Wrapper[];
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
      LocalCourseName: { 
        title: 'Local Course',
        type: 'custom',
        renderComponent: AccordionViewComponent,
        onComponentInitFunction(instance) {
          //console.log(instance);
        }
      }
    },
    pager: {
      perPage: 100
    },
    actions: {
      add: false,
      delete: false,
      edit: false
    },
    hideSubHeader: true
  };
  
  
  constructor(private localCourseService: LocalCourseService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.localCourseService.getLocalCourses().then(courses => {
      this.courses = courses;
      //console.log(courses);
      this.source = new LocalDataSource(this.courses);
    });
  
    subscribeChanges(this.changes.LocalCourseName, (search) => {
      this.source.addFilter({field: 'LocalCourseName', search: search});
      this.currentLocalCourseSearch = search;
    });
    
    this.localCourseService.getSchools().then(schools => {
      this.schools = schools;
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
    
    this.localCourseService.getLocalCoursesPlain().then(localCourses => {
      this.localCourses = localCourses;
    });
    
    this.currentLocalCourseSearch = "";
  }
  
  //local courses typeahead
  searchLocalCourse = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
          : this.localCourses.filter(v => contains(v.LocalCourseName, term)).slice(0, 10)
  );
  
  formatterLocalCourse = (x: LocalCoursePlain) => x.LocalCourseName;

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
             // the schools router for this is broken for now, will fix later
            //var schools;
            console.log("query school: " + result2.SchoolName);
            /*
            this.localCourseService.getSchool(result2.SchoolName).then(schools => {
              console.log("returned schools 1:");
              console.log(schools);
              //schools = schools2;
              console.log("returned schools 2:");
              //console.log(schools);
              if(schools.length != 1){
                console.log("School \"" + result2.SchoolName + "\" does not exist. Enter a valid school.");
              
              //if(false){
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
            });
            */
            var found = false;
            for(var i = 0; i < this.schools.length; ++i){
              if(this.schools[i].Name === result2.SchoolName){
                console.log("school was found");
                found = true;
                i = this.schools.length+999;
              }
            }
            if(!found){
              console.log("school was not found");
            }
            
            if(result.Lock){
              //get current user's userid, shove it into result2.LockedBy
              result.LockedBy = 0;
              result2.LockedBy = 0;
            }else{
              result.LockedBy = 0;
              result2.LockedBy = null;
            }
            console.log(result2);
            this.localCourseService.addEquivCourse(result2);
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
      alert("You don't have permission to edit this equivalency. Consult " + foreignCourse.LockedByUser + " or an Admin to edit it.");
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
  addCourse(content2){
    //console.log("add new local course");
	  this.dialogInputs2.Mode = "Add";
	  this.modalService.open(content2).result.then((result) => {
      if(result === "Close"){
        console.log("Closed, don't add");
      }else{
        console.log(result.Dept + " " + result.CourseNum + " - " + result.CourseTitle);
        if(result.Dept == null || result.CourseNum == null || result.CourseTitle == null){
          console.log("null check, don't add");
        }else{
          result.Dept = result.Dept.trim().toUpperCase();
          result.CourseNum = result.CourseNum.trim();
          result.CourseTitle = result.CourseTitle.trim();
          //console.log(result.Dept + " " + result.CourseNum + " - " + result.CourseTitle);
          if(result.Dept === "" || result.CourseNum === "" || result.CourseTitle === ""){
            console.log("empty check, don't add");
          }else{
            this.localCourseService.addLocalCourse(result)
            .then(http => {
              let result2 = http.json();
              //console.log(result2);
              var newLocalCourse: LocalCourse2 = {
                LocalCourseID: result2.stmt.lastID,
                LocalCourseName: result.Dept + " " + result.CourseNum + " - " + result.CourseTitle,
                ForeignCourses: new Array<ForeignCourse2>()
              };
              //console.log("new course: ");
              //console.log(newLocalCourse);
              this.courses.push(newLocalCourse);
              this.courses.sort((c1, c2) => {
                if(c1.LocalCourseName > c2.LocalCourseName) return 1;
                if(c1.LocalCourseName < c2.LocalCourseName) return -1;
                return 0;
              });
              //console.log(this.courses);
              this.source = new LocalDataSource(this.courses);
              this.changes.LocalCourseName.next("");
              this.changes.LocalCourseName.next(this.currentLocalCourseSearch);
            })
            .catch(err => console.log(err));
          }
        }
      }
	  });
  }
}