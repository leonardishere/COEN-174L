import { Component, OnInit, Input, Output, EventEmitter, NgModule } from '@angular/core';
import { LocalCourse2 } from './../models/local_course2';
import { ForeignCourse2 } from './../models/foreign_course2';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import { Ng2SmartTableModule, LocalDataSource, ViewCell } from 'ng2-smart-table';
import { LocalCourseService } from './../services/local_courses';
import { subscribeChanges, contains } from '../utils';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { School } from './../models/school';
import { LocalCoursePlain } from './../models/local_course_plain';
import { ForeignCourseSchool } from './../models/foreign_course_school';
import { EquivCourse } from './../models/equiv_course';
import { Status } from './../models/status';

//global vars
var localCoursesGlobal: LocalCoursePlain[];
var schoolsGlobal: School[];
var foreignCoursesSchoolsGlobal: ForeignCourseSchool[];
var statusesGlobal: Status[];
var localCourseComponentGlobal: any;

//accordion component
@Component({
  selector: 'accordion-view',
  templateUrl: './local_courses_accordion.html',
  styles: [`
    table { width: 100%; }
    .local_course_modify_buttons {
      float: right;
      display: inline-block;
      color: #111;
    }
  `]
})
export class LocalAccordionViewComponent implements ViewCell, OnInit {
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
    SchoolName: new Subject<string>()
  };
  
  constructor(private localCourseService: LocalCourseService,
    private modalService: NgbModal) { }
    
  ngOnInit(){
    this.course = this.value;
    this.dialogCourse = this.rowData;
    
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
          
          result3.Notes = result.Notes.trim();
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
                  var found2 = false;
                  for(var j = 0; j < course.ForeignCourses.length && !found2; ++j){
                    if(course.ForeignCourses[j].ForeignCourseID === result4.ForeignCourseID){
                      found2 = true;
                      alert("That equivalency already exists. Refresh and try again.");
                    }
                  }
                  if(!found2){
                    this.localCourseService.addEquivCourse(result4)
                    .then(promise => {
                      result4.EquivID = promise.row;
                      result3.EquivID = promise.row;
                      console.log(result3);
                    })
                    .catch(err => console.log(err));
                    course.ForeignCourses.push(result3);
                    course.ForeignCourses.sort((c1, c2) => {
                      if(c1.SchoolName > c2.SchoolName) return 1;
                      if(c1.SchoolName < c2.SchoolName) return -1;
                        
                      if(c1.ForeignCourseName > c2.ForeignCourseName) return 1;
                      if(c1.ForeignCourseName < c2.ForeignCourseName) return -1;
                      return 0;
                    });
                  }
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
    this.dialogInputs.Status = {'Status': foreignCourse.Status};
    this.dialogInputs.Lock = foreignCourse.LockedBy != null;
    this.dialogInputs.Notes = foreignCourse.Notes;
    
    this.modalService.open(content).result.then((result) => {
      if(result === "Close"){
        console.log("Closed, don't edit");
      }else{
        if(result.Status == null || result.Lock == null || result.Notes == null){
          console.log("null check, don't add");
        }else{
          //add to database
          var result4: EquivCourse = {EquivID: -1, LocalCourseID: -1, ForeignCourseID: -1, Status: '', LockedBy: -1, Notes: ''};
          result4.Notes = result.Notes.trim();
          result4.LocalCourseID = result.LocalCourseID;
          
          result4.EquivID = foreignCourse.EquivID;
          result4.LocalCourseID = localCourse.LocalCourseID;
          result4.ForeignCourseID = foreignCourse.ForeignCourseID;
          
          var lockedBy = 0;
          var lockedByUser = '';

          if(result.Lock){
            //get current user's userid, shove it into result3+4.LockedBy
            result.LockedBy = 0;
            lockedBy = 0;
            lockedByUser = 'Andrew Leonard';
            result4.LockedBy = 0;
          }else{
            result.LockedBy = 0;
            lockedBy = null;
            lockedByUser = '';
            result4.LockedBy = null;
          }
          
          if(result.Status.Status == null){
            result4.Status = result.Status;
          }else{
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
    console.log(localCourse);
    
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
          
          localCourse.LocalCourseDept = result.Dept.toUpperCase();
          localCourse.LocalCourseNum = result.CourseNum;
          localCourse.LocalCourseTitle = result.CourseTitle;
          localCourse.LocalCourseName = result.Dept.toUpperCase() + " " + result.CourseNum + " - " + result.CourseTitle;
          
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
    localCoursesGlobal = localCoursesGlobal.filter(lc => 
      lc.LocalCourseName !== localCourse.LocalCourseName
    );      
  }
  
  //typeaheads
  searchSchool = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : schoolsGlobal.filter(v => contains(v.Name, term)).slice(0, 10));
  
  formatterSchool = (x: School) => x.Name;
  
  searchForeignCourse = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : foreignCoursesSchoolsGlobal.filter(v => contains(v.ForeignCourseName, term) && contains(v.SchoolName, this.currentSchool)).slice(0, 10));
        
  formatterForeignCourse = (x: ForeignCourseSchool) => x.ForeignCourseName;
  
  searchStatus = (text$: Observable<string>) =>
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
  templateUrl: './local_courses.html',
  styles: [`
    table { width: 100%; }
  `],
  entryComponents: [LocalAccordionViewComponent]
})
@NgModule({
  imports: [ LocalAccordionViewComponent ],
  entryComponents: [ LocalAccordionViewComponent ]
})
export class LocalCoursesComponent implements OnInit {
  schools: School[];
  foreignCourses: string[]; //should be foreignCourse[]
  statuses: string[];
  currentLocalCourseSearch: string;
  
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
        renderComponent: LocalAccordionViewComponent,
        onComponentInitFunction(instance) {}
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
    
    statusesGlobal = [{'Status': 'Accepted'}, {'Status': 'Rejected'}];
    
    this.localCourseService.getLocalCoursesPlain().then(localCourses => {
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
          : localCoursesGlobal.filter(v => contains(v.LocalCourseName, term)).slice(0, 10)
  );
  
  formatterLocalCourse = (x: LocalCoursePlain) => x.LocalCourseName;

  //add new course
  addLocalCourse(content){
	  this.dialogInputs2.Mode = "Add";
	  this.modalService.open(content).result.then((result) => {
      if(result === "Close"){
        console.log("Closed, don't add");
      }else{
        if(result.Dept == null || result.CourseNum == null || result.CourseTitle == null){
          console.log("null check, don't add");
        }else{
          result.Dept = result.Dept.trim().toUpperCase();
          result.CourseNum = result.CourseNum.trim();
          result.CourseTitle = result.CourseTitle.trim();
          if(result.Dept === "" || result.CourseNum === "" || result.CourseTitle === ""){
            console.log("empty check, don't add");
          }else{
            var courseName = result.Dept + " " + result.CourseNum + " - " + result.CourseTitle;
            var found = false;
            for(var i = 0; i < localCoursesGlobal.length && !found; ++i){
              if(localCoursesGlobal[i].LocalCourseName === courseName){
                found = true;
                alert("That course exists already. Refresh and try again.");
              }
            }
            if(!found){
              this.localCourseService.addLocalCourse(result)
              .then(http => {
                var newLocalCourse: LocalCourse2 = {
                  LocalCourseID: http.stmt.lastID,
                  LocalCourseDept: result.Dept,
                  LocalCourseNum: result.CourseNum,
                  LocalCourseTitle: result.CourseTitle,
                  LocalCourseName: result.Dept + " " + result.CourseNum + " - " + result.CourseTitle,
                  ForeignCourses: new Array<ForeignCourse2>()
                };
                this.courses.push(newLocalCourse);
                this.courses.sort((c1, c2) => {
                  if(c1.LocalCourseName > c2.LocalCourseName) return 1;
                  if(c1.LocalCourseName < c2.LocalCourseName) return -1;
                  return 0;
                });
                
                this.source = new LocalDataSource(this.courses);
                this.source.addFilter({field: 'LocalCourseName', search: this.currentLocalCourseSearch});
                
                var newLocalCoursePlain: LocalCoursePlain = {
                  LocalCourseID: http.stmt.lastID,
                  LocalCourseName: result.Dept + " " + result.CourseNum + " - " + result.CourseTitle
                };
                localCoursesGlobal.push(newLocalCoursePlain);
                localCoursesGlobal.sort((c1, c2) => {
                  if(c1.LocalCourseName > c2.LocalCourseName) return 1;
                  if(c1.LocalCourseName < c2.LocalCourseName) return -1;
                  return 0;
                });
              })
              .catch(err => console.log(err));
            }
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