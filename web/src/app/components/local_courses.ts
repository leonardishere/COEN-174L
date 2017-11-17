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
//import { AccordionViewComponent } from './local_courses_accordion';

//global vars work
var localCoursesGlobal: LocalCoursePlain[];
var schoolsGlobal: School[];
var foreignCoursesGlobal: string[]; //should be foreignCourse[]
  //foreignCourses: ForeignCourse[];
  //foreignCourses: any[];
var statusesGlobal: string[];

@Component({
  selector: 'accordion-view',
  templateUrl: './local_courses_accordion_template.html',
  styles: [`
    table { width: 100%; }
  `]
})
export class AccordionViewComponent implements ViewCell, OnInit {
  @Input() rowData: any;
  course: string;
  @Input() value: string;
  
  dialogCourse: LocalCourse2;
  
  dialogInputs = {
	  Mode: "Add Equivalency",
	  SchoolName: "",
	  ForeignCourseName: "",
	  Status: "",
    Lock: "",
	  Notes: ""
  }
  
  constructor(private localCourseService: LocalCourseService,
    private modalService: NgbModal) { }
    
  ngOnInit(){
    this.course = this.value;
  }
  
  addEquivCourse(content, course){
    console.log("addEquivCourse()");
    this.dialogInputs.Mode = "Add";
    this.dialogCourse = course;
    this.modalService.open(content).result.then((result) => {
      course.ForeignCourses.push(result);
      console.log(course);
      result.LocalCourseID = course.LocalCourseID;
      
      //console.log(result);
      //console.log(result.SchoolName);      
      
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
            //console.log("query school: " + result2.SchoolName);
            /*
            this.localCourseService.getSchool(result2.SchoolName).then(schools => {
              console.log("returned schools 1:");
              console.log(schools);
              //schools = schools2;
              console.log("returned schools 2:");
              //console.log(schools);
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
            //});
            
            var found = false;
            for(var i = 0; i < schoolsGlobal.length; ++i){
              if(schoolsGlobal[i].Name === result2.SchoolName){
                console.log("school was found");
                found = true;
                i = schoolsGlobal.length+999;
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
  
  //equivalency typeahead
  search1 = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : schoolsGlobal.filter(v => v.Name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
  
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
        : foreignCoursesGlobal.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
        
  search3 = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 0 ? []
        : statusesGlobal.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
}

//main component
@Component({
  selector: 'local-courses',
  templateUrl: './local_courses_template.html',
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
      schoolsGlobal = schools;
    });
    
    this.foreignCourses = new Array<string>();
    foreignCoursesGlobal = new Array<string>();
    this.localCourseService.getForeignCourses().then(foreignCourses => {
      //this.foreignCourses = foreignCourses;
      foreignCourses.forEach(foreignCourse => {
        this.foreignCourses.push(foreignCourse.ForeignCourseName);
        foreignCoursesGlobal.push(foreignCourse.ForeignCourseName);
      });
      //console.log(this.foreignCourses);
    });
    
    this.statuses = new Array<string>();
    this.statuses.push("Accepted");
    this.statuses.push("Rejected");
    
    statusesGlobal = new Array<string>();
    statusesGlobal.push("Accepted");
    statusesGlobal.push("Rejected");
    
    this.localCourseService.getLocalCoursesPlain().then(localCourses => {
      this.localCourses = localCourses;
      localCoursesGlobal = localCourses;
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
        //console.log(result.Dept + " " + result.CourseNum + " - " + result.CourseTitle);
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
              //console.log(http);
              //let result2 = http.json();
              let result2 = http;
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