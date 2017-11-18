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
import { ForeignCourseSchool } from './../models/foreign_course_school';
import { EquivCourse } from './../models/equiv_course';
import { Status } from './../models/status';

//these werent required earlier
import { NgbAccordion, NgbPanel } from '@ng-bootstrap/ng-bootstrap/accordion/accordion';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion/accordion.module';
//import { AccordionViewComponent } from './local_courses_accordion';

//global vars work
var localCoursesGlobal: LocalCoursePlain[];
var schoolsGlobal: School[];
var foreignCoursesSchoolsGlobal: ForeignCourseSchool[];
var statusesGlobal: Status[];
var localCourseComponentGlobal: any;

@Component({
  selector: 'accordion-view',
  templateUrl: './local_courses_accordion_template.html',
  styles: [`
    table { width: 100%; }
    .header_buttons {
      float: right;
      display: inline-block;
      color: #111;
    }
  `]
})
export class AccordionViewComponent implements ViewCell, OnInit {
  @Input() rowData: any;
  course: string;
  @Input() value: string;
  
  dialogCourse: LocalCourse2;
  dialogForeignCourse: ForeignCourse2;
  
  currentSchool: string;
  
  dialogInputs = {
	  Mode: "Add Equivalency",
	  SchoolName: "",
	  ForeignCourseName: "",
	  Status: {'Status': ''},
    Lock: false,
	  Notes: ""
  }
  dialogInputs2 = {
    Name: "",
	  Dept: "",
	  CourseNum: "",
	  CourseTitle: "",
    LocalCourseID: -1
  }
  
  changes = {
    //LocalCourseName: new Subject<string>(),
    SchoolName: new Subject<string>(),
    //ForeignCourseName: new Subject<string>()//,
    //Status: new Subject<string>()
  };
  
  constructor(private localCourseService: LocalCourseService,
    private modalService: NgbModal) { }
    
  ngOnInit(){
    this.course = this.value;
    //console.log(this.rowData);
    this.dialogCourse = this.rowData;
    //console.log(this.dialogCourse);
    
    subscribeChanges(this.changes.SchoolName, (search) => {
      this.currentSchool = search;
    });
    
    this.currentSchool = '';
  }
  
  addEquivCourse(content, course){
    console.log("addEquivCourse()");
    this.dialogInputs.Mode = "Add";
    this.dialogCourse = course;
    this.modalService.open(content).result.then((result) => {
      result.LocalCourseID = course.LocalCourseID;
      if(result === "Close"){
        console.log("Closed, don't add");
      }else{
        if(result.Mode == null || result.SchoolName == null || result.ForeignCourseName == null || result.Status == null || result.Lock == null || result.Notes == null){
          console.log("null check, don't add");
        }else{
          //display
          var result3: ForeignCourse2 = {EquivID: -1, ForeignCourseID: -1, ForeignCourseName:'',SchoolName:'',Status:'', LockedBy:-1, LockedByUser:'', Notes:''};
          //add to database
          var result4: EquivCourse = {EquivID: -1, LocalCourseID: -1, ForeignCourseID: -1, Status: '', LockedBy: -1, Notes: ''};
          //result3.Status = result.Status;
          result3.Notes = result.Notes.trim();
          //result4.Status = result.Status;
          result4.Notes = result.Notes.trim();
          result4.LocalCourseID = result.LocalCourseID;
          
          if(result.SchoolName.Name == null){
            result3.SchoolName = result.SchoolName;
          }else{
            result3.SchoolName = result.SchoolName.Name;
          }
          
          if(result.ForeignCourseName.ForeignCourseName == null){
            result3.ForeignCourseName = result.ForeignCourseName;
          }else{
            result3.ForeignCourseName = result.ForeignCourseName.ForeignCourseName;
          }
          
          if(result.Lock){
            //get current user's userid, shove it into result3+4.LockedBy
            result.LockedBy = 0;
            result3.LockedBy = 0;
            result3.LockedByUser = 'Andrew Leonard';
            result4.LockedBy = 0;
          }else{
            result.LockedBy = 0;
            result3.LockedBy = null;
            result3.LockedByUser = '';
            result4.LockedBy = null;
          }
          
          if(result.Status.Status == null){
            result3.Status = result.Status;
            result4.Status = result.Status;
          }else{
            result3.Status = result.Status.Status;
            result4.Status = result.Status.Status;
          }
          
          if(result.Mode === "" || result3.SchoolName === "" || result.ForeignCourseName === "" || result.Status === ""){
            console.log("empty check, don't add");
          }else{
            var found = false;
            for(var i = 0; i < foreignCoursesSchoolsGlobal.length && !found; ++i){
              if(foreignCoursesSchoolsGlobal[i].SchoolName === result3.SchoolName && foreignCoursesSchoolsGlobal[i].ForeignCourseName === result3.ForeignCourseName){
                found = true;
                result4.ForeignCourseID = foreignCoursesSchoolsGlobal[i].ForeignCourseID;
                result3.ForeignCourseID = foreignCoursesSchoolsGlobal[i].ForeignCourseID;
                
                if(result4.Status !== "Accepted" && result4.Status !== "Rejected"){
                  alert("The status must be either \"Accepted\" or \"Rejected\". Try again.");
                }else{
                  this.localCourseService.addEquivCourse(result4)
                  .then(promise => {
                    result4.EquivID = promise.row;
                    result3.EquivID = promise.row;
                    console.log(result3);
                    //course.ForeignCourses.push(result3);
                  })
                  .catch(err => console.log(err));
                  course.ForeignCourses.push(result3);
                }
              }
            }
            if(!found){
              alert("School (" + result3.SchoolName + ") and foreign course (" + result3.ForeignCourseName + ") combination was not found. If you believe that this is an error, refresh and try again.");
            }
          }
        }
        
        result.Mode = "";
        result.SchoolName = "";
        result.ForeignCourseName = "";
        result.Status = "";
        result.Lock = false;
        result.Notes = "";
      }
    })
    .catch(err => {
      console.log("Closed via cross click");
    });
  }
    
  editEquivCourse(content, localCourse, foreignCourse){
    console.log("editEquivCourse()");
    console.log(content);
    console.log(localCourse);
    console.log(foreignCourse);
    
    //check if user has permission
    var currentUserID = 0; //get these
    var currentUserName = "Andrew Leonard";
    var currentUserPosition = "not an admin";
    if(foreignCourse.LockedBy != null && foreignCourse.LockedBy !== currentUserID && currentUserPosition !== "Admin"){
      alert("You don't have permission to edit this equivalency. Contact " + foreignCourse.LockedByUser + " or an Admin to edit it.");
      return;
    }
    
    this.dialogCourse = localCourse;
    this.dialogForeignCourse = foreignCourse;
    //this.dialogInputs.Status = foreignCourse.Status;
    this.dialogInputs.Status = {'Status': foreignCourse.Status};
    this.dialogInputs.Lock = foreignCourse.LockedBy != null;
    this.dialogInputs.Notes = foreignCourse.Notes;
    
    this.modalService.open(content).result.then((result) => {
      //console.log(result);
      if(result === "Close"){
        console.log("Closed, don't edit");
      }else{
        if(result.Status == null || result.Lock == null || result.Notes == null){
          console.log("null check, don't add");
        }else{
          //display
          //var result3: ForeignCourse2 = {EquivID: -1, ForeignCourseID: -1, ForeignCourseName:'',SchoolName:'',Status:'', LockedBy:-1, LockedByUser:'', Notes:''};
          //add to database
          var result4: EquivCourse = {EquivID: -1, LocalCourseID: -1, ForeignCourseID: -1, Status: '', LockedBy: -1, Notes: ''};
          //result3.Notes = result.Notes.trim();
          //foreignCourse.Notes = result.Notes.trim();
          //result4.Status = result.Status;
          result4.Notes = result.Notes.trim();
          result4.LocalCourseID = result.LocalCourseID;
          
          result4.EquivID = foreignCourse.EquivID;
          result4.LocalCourseID = localCourse.LocalCourseID;
          result4.ForeignCourseID = foreignCourse.ForeignCourseID;
          
          /*
          if(result.SchoolName.Name == null){
            result3.SchoolName = result.SchoolName;
          }else{
            result3.SchoolName = result.SchoolName.Name;
          }
          */
          
          /*
          if(result.ForeignCourseName.ForeignCourseName == null){
            result3.ForeignCourseName = result.ForeignCourseName;
          }else{
            result3.ForeignCourseName = result.ForeignCourseName.ForeignCourseName;
          }
          */
          
          var lockedBy = 0;
          var lockedByUser = '';

          if(result.Lock){
            //get current user's userid, shove it into result3+4.LockedBy
            result.LockedBy = 0;
            //result3.LockedBy = 0;
            //result3.LockedByUser = 'Andrew Leonard';
            //foreignCourse.LockedBy = 0;
            //foreignCourse.LockedByUser = 'Andrew Leonard';
            lockedBy = 0;
            lockedByUser = 'Andrew Leonard';
            result4.LockedBy = 0;
          }else{
            result.LockedBy = 0;
            //result3.LockedBy = null;
            //result3.LockedByUser = '';
            //foreignCourse.LockedBy = null;
            //foreignCourse.LockedByUser = '';
            lockedBy = null;
            lockedByUser = '';
            result4.LockedBy = null;
          }
          
          if(result.Status.Status == null){
            //result3.Status = result.Status;
            //foreignCourse.Status = result.Status;
            result4.Status = result.Status;
          }else{
            //result3.Status = result.Status.Status;
            //foreignCourse.Status = result.Status.Status;
            result4.Status = result.Status.Status;
          }
          
          if(result4.Status !== "Accepted" && result4.Status !== "Rejected"){
            alert("The status must be either \"Accepted\" or \"Rejected\". Try again.");
          }else{
            foreignCourse.Status = result4.Status;
            foreignCourse.LockedBy = lockedBy;
            foreignCourse.LockedByUser = lockedByUser;
            foreignCourse.Notes = result4.Notes;
            this.localCourseService.editEquivCourse(result4);
          }
        }
      }
    })
    .catch(err => {
      console.log("Closed via cross click");
    });
  }
  
  deleteEquivCourse(localCourse, foreignCourse) {
    //check if user has permission
    var currentUserID = 0; //get these
    var currentUserName = "Andrew Leonard";
    var currentUserPosition = "not an admin";
    if(foreignCourse.LockedBy != null && foreignCourse.LockedBy !== currentUserID && currentUserPosition !== "Admin"){
      alert("You don't have permission to delete this equivalency. Contact " + foreignCourse.LockedByUser + " or an Admin to delete it.");
      return;
    }
    
    localCourse.ForeignCourses = localCourse.ForeignCourses.filter(fc =>
	    fc.ForeignCourseName !== foreignCourse.ForeignCourseName
    );
    foreignCourse.LocalCourseID = localCourse.LocalCourseID;
    this.localCourseService.deleteEquivCourse(foreignCourse);
  }
   
  editLocalCourse(event, content, localCourse){
    event.preventDefault();
    event.stopPropagation();
    console.log("editLocalCourse()");
    //console.log(localCourse);
    
    //check if user has permission
    var currentUserID = 0; //get these
    var currentUserName = "Andrew Leonard";
    var currentUserPosition = "Admin";
    if(currentUserPosition !== "Admin"){
      alert("You don't have permission to edit courses. Contact an Admin to edit it.");
      return;
    }
    
    this.dialogInputs2.Name = localCourse.LocalCourseName;
    this.dialogInputs2.Dept = localCourse.LocalCourseDept;
    this.dialogInputs2.LocalCourseID = localCourse.LocalCourseID;
    this.dialogInputs2.CourseNum = localCourse.LocalCourseNum;
    this.dialogInputs2.CourseTitle = localCourse.LocalCourseTitle;
    
    this.modalService.open(content).result.then((result) => {
      console.log(result);
      if(result === "Close"){
        console.log("Closed, don't edit");
      }else{
        if(result.Dept == null || result.CourseNum == null || result.CourseTitle == null){
          console.log("null check, don't add");
        }else{
          var result2 = {LocalCourseID: localCourse.LocalCourseID, Dept: result.Dept.toUpperCase(), CourseNum: result.CourseNum, CourseTitle: result.CourseTitle};
          console.log(result2);
          this.localCourseService.editLocalCourse(result2)
          .catch(err => {
            console.log(err);
          });
          
          //localCourse.LocalCourseName = result.Dept + " " + result.CourseNum + " - " + result.CourseTitle;
          this.course = result.Dept.toUpperCase() + " " + result.CourseNum + " - " + result.CourseTitle;
          console.log(this.course);
        }
      }
    })
    .catch(err => {console.log("closed via cross click");});
  }
  
  deleteLocalCourse(event, localCourse){
    event.preventDefault();
    event.stopPropagation();
    console.log("deleteLocalCourse()");
    console.log(localCourse);
    
    //check if user has permission
    var currentUserID = 0; //get these
    var currentUserName = "Andrew Leonard";
    var currentUserPosition = "Admin";
    if(currentUserPosition !== "Admin"){
      alert("You don't have permission to delete courses. Contact an Admin to delete it.");
      return;
    }
    
    this.localCourseService.deleteLocalCourse(localCourse);
    localCourseComponentGlobal.deleteLocalCourse(localCourse);
  }
  
  //equivalency typeahead
  search1 = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : schoolsGlobal.filter(v => v.Name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
  
  formatter1 = (x: {Name: string}) => x.Name;
  
  search2 = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : foreignCoursesSchoolsGlobal.filter(v => {
          //console.log(v);
          //console.log("ForeignCourseName: " + v.ForeignCourseName);
          //console.log("SchoolName: " + v.SchoolName);
          //return true;
          return (contains(v.ForeignCourseName, term) && contains(v.SchoolName, this.currentSchool));
        }).slice(0, 10));
        
  formatterForeignCourse = (x: ForeignCourseSchool) => x.ForeignCourseName;
  
  search3 = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : statusesGlobal.filter(v => contains(v.Status, term)).slice(0, 10));
        
  formatterStatus = (x: Status) => x.Status
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
    
    this.statuses = new Array<string>();
    this.statuses.push("Accepted");
    this.statuses.push("Rejected");
    
    /*
    statusesGlobal = new Array<string>();
    statusesGlobal.push("Accepted");
    statusesGlobal.push("Rejected");
    */
    statusesGlobal = [{'Status': 'Accepted'}, {'Status': 'Rejected'}];
    
    this.localCourseService.getLocalCoursesPlain().then(localCourses => {
      this.localCourses = localCourses;
      localCoursesGlobal = localCourses;
    });
    
    this.currentLocalCourseSearch = "";
    
    this.localCourseService.getForeignCoursesSchools().then(foreignCoursesSchools => {
      foreignCoursesSchoolsGlobal = foreignCoursesSchools;
    });
    
    localCourseComponentGlobal = this;
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
                
                LocalCourseDept: result.Dept,
                LocalCourseNum: result.Num,
                LocalCourseTitle: result.Title,
                
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
  
  deleteLocalCourse(course){
    this.courses = this.courses.filter(lc =>
      lc.LocalCourseName !== course.LocalCourseName
    );
    this.source = new LocalDataSource(this.courses);
    subscribeChanges(this.changes.LocalCourseName, (search) => {
      this.source.addFilter({field: 'LocalCourseName', search: search});
      this.currentLocalCourseSearch = search;
    });
  }
}