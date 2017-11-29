import { Component, OnInit, Input, Output, EventEmitter, NgModule } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule, LocalDataSource, ViewCell } from 'ng2-smart-table';
//import { ForeignCourseJoined } from './../models/foreign_course_joined';
import { LocalCourse3 } from './../models/local_course3';
import { ForeignCourse3 } from './../models/foreign_course3';
import { ForeignCourseService } from './../services/foreign_courses';
import { AuthService } from '../services/auth.service';
import { subscribeChanges, contains } from '../utils';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subject } from 'rxjs/Subject';

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
var foreignCourseComponentGlobal: any;

//accordion component
@Component({
  selector: 'accordion-view',
  templateUrl: './foreign_courses_accordion.html',
  styles: [`
    table { width: 100%; }
    .foreign_course_modify_buttons {
      float: right;
      display: inline-block;
      color: #111;
    }
  `]
})
export class ForeignAccordionViewComponent implements ViewCell, OnInit {
  @Input() rowData: any;
  course: string;
  @Input() value: string;
  
  dialogLocalCourse: LocalCourse3;
  dialogCourse: ForeignCourse3;
  isAdmin: boolean;
  
  dialogInputs = {
	  Mode: "Add Equivalency",
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
    ForeignCourseID: -1,
    SchoolName: "",
    School2: {SchoolID: -1, Name: ''}
  }
  
  placeholders = {
    //ForeignCourseName: "CMPE 200 - Computer Architecture",
    SchoolName: "San Jose State University"
  };
  
  constructor(private foreignCourseService: ForeignCourseService,
    private modalService: NgbModal,
    private auth: AuthService) {}
  
  ngOnInit(){
    this.course = this.rowData.ForeignCourseName + " | " + this.rowData.SchoolName;
    this.isAdmin = foreignCourseComponentGlobal.isAdmin;
  }
  
  editForeignCourse(event, content, foreignCourse){
    console.log("editLocalCourse()");
    event.preventDefault();
    event.stopPropagation();
    
    //check if user has permission
    var currentUserID = this.auth.UserID;
    if(!this.auth.isAdmin()){
      alert("You don't have permission to edit courses. Contact an Admin to edit it.");
      return;
    }
    
    this.dialogInputs2.Name = foreignCourse.ForeignCourseName;
    this.dialogInputs2.Dept = foreignCourse.ForeignCourseDept;
    this.dialogInputs2.ForeignCourseID = foreignCourse.ForeignCourseID;
    this.dialogInputs2.CourseNum = foreignCourse.ForeignCourseNum;
    this.dialogInputs2.CourseTitle = foreignCourse.ForeignCourseTitle;
    this.dialogInputs2.SchoolName = foreignCourse.SchoolName;
    this.dialogInputs2.School2.Name = foreignCourse.SchoolName;
    
    this.modalService.open(content).result.then((result) => {
      console.log(result);
      if(result === "Close"){
        console.log("Closed, don't edit");
      }else{
        if(result.Dept == null || result.CourseNum == null || result.CourseTitle == null){
          console.log("null check, don't edit");
        }else{
          result.Dept = result.Dept.trim().toUpperCase();
          result.CourseNum = result.CourseNum.trim();
          result.CourseTitle = result.CourseTitle.trim();
          if(result.School2.Name != null) result.SchoolName = result.School2.Name;
          else result.SchoolName = result.School2.trim();
          
          if(result.School === "" || result.Dept === "" || result.CourseNum === "" || result.CourseTitle === ""){
            console.log("empty check, don't add");
          }else{
            var courseName = result.Dept + " " + result.CourseNum + " - " + result.CourseTitle;
              
            var found1 = false;
            for(var i = 0; i < schoolsGlobal.length && !found1; ++i){
              if(schoolsGlobal[i].Name === result.School2.Name){
                found1 = true;
                result.SchoolID = schoolsGlobal[i].SchoolID;
                
                var found2 = false;
                for(var i = 0; i < foreignCoursesSchoolsGlobal.length && !found2; ++i){
                  if(foreignCoursesSchoolsGlobal[i].SchoolName === result.School && foreignCoursesSchoolsGlobal[i].ForeignCourseName === courseName){
                    alert("That course already exists. Refresh and try again.");
                    found2 = true;
                  }
                }
                if(!found2){
                  console.log("send results to database");
                  var newForeignCourse: ForeignCourse3 = {
                    ForeignCourseID: result.ForeignCourseID,
                    ForeignCourseDept: result.Dept,
                    ForeignCourseNum: result.CourseNum,
                    ForeignCourseTitle: result.CourseTitle,
                    ForeignCourseName: courseName,
                    SchoolID: result.SchoolID,
                    SchoolName: result.SchoolName,
                    LocalCourses: foreignCourse.LocalCourses
                  };
                  var toDb = {
                    ForeignCourseID: result.ForeignCourseID,
                    Dept: result.Dept,
                    CourseNum: result.CourseNum,
                    Title: result.CourseTitle,
                    SchoolID: result.SchoolID
                  };
                  
                  this.foreignCourseService.editForeignCourse(toDb)
                  .then(http => {
                    foreignCourseComponentGlobal.editForeignCourse(newForeignCourse);
                  })
                  .catch(err => {console.log(err);});
                }
              }
            }
          }
        }
      }
    })
    .catch(err => {console.log("closed via cross click");});
  }
  
  deleteForeignCourse(event, foreignCourse){
    console.log("editLocalCourse()");
    event.preventDefault();
    event.stopPropagation();
    
    //check if user has permission
    var currentUserID = this.auth.UserID;
    if(!this.auth.isAdmin()){
      alert("You don't have permission to edit courses. Contact an Admin to edit it.");
      return;
    }
    
    this.foreignCourseService.deleteForeignCourse(foreignCourse);
    foreignCourseComponentGlobal.deleteForeignCourse(foreignCourse);
  }
  
  addEquivCourse(content, course){
    console.log("addEquivCourse()");
    console.log(content);
    console.log(course);
    
    this.dialogCourse = course;
    this.dialogInputs.ForeignCourseName = course.ForeignCourseName;
    this.modalService.open(content).result.then((result) => {
      console.log(result);
      if(result === "Close"){
        console.log("Closed, don't add");
      }else{
        if(result.Mode == null || result.ForeignCourseName == null || result.Status == null || result.Lock == null || result.Notes == null){
          console.log("null check, don't add");
        }else{
          //display
          var result3: LocalCourse3 = {EquivID: -1, LocalCourseID: -1, LocalCourseName:'',Status:'', LockedBy:-1, LockedByUser:'', Notes:''};
          //add to database
          var result4: EquivCourse = {EquivID: -1, LocalCourseID: -1, ForeignCourseID: -1, Status: '', LockedBy: -1, Notes: ''};
          
          result3.Notes = result.Notes.trim();
          result4.Notes = result.Notes.trim();
          result4.ForeignCourseID = course.ForeignCourseID;
          
          if(result.LocalCourseName.LocalCourseName == null){
            result3.LocalCourseName = result.LocalCourseName;
          }else{
            result3.LocalCourseName = result.LocalCourseName.LocalCourseName;
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
          
          if(result.LocalCourseName === "" || result.Status === ""){
            console.log("empty check, don't add");
          }else{
            var found = false;
            for(var i = 0; i < localCoursesGlobal.length && !found; ++i){
              if(localCoursesGlobal[i].LocalCourseName === result3.LocalCourseName){
                found = true;
                result3.LocalCourseID = localCoursesGlobal[i].LocalCourseID;
                result4.LocalCourseID = localCoursesGlobal[i].LocalCourseID;
                
                if(result4.Status !== "Accepted" && result4.Status !== "Rejected"){
                  alert("The status must be either \"Accepted\" or \"Rejected\". Try again.");
                }else if(foreignCourseComponentGlobal.containsEquivalency(result4.LocalCourseID, result4.ForeignCourseID)){
                  alert("That equivalency already exists. Refresh and try again.");
                }else{
                  this.foreignCourseService.addEquivCourse(result4)
                  .then(promise => {
                    result4.EquivID = promise.row;
                    result3.EquivID = promise.row;
                    console.log(result3);
                  })
                  .catch(err => console.log(err));
                  course.LocalCourses.push(result3);
                  course.LocalCourses.sort((c1, c2) => {
                    if(c1.LocalCourseName > c2.LocalCourseName) return 1;
                    if(c1.LocalCourseName < c2.LocalCourseName) return -1;
                    return 0;
                  });
                }
              }
            }
            if(!found){
              alert("Local course (" + result3.LocalCourseName + ") was not found. If you believe that this is an error, refresh and try again.");
            }
          }
        }
        
        result.Mode = "";
        result.LocalCourseName = "";
        result.Status = "";
        result.Lock = false;
        result.Notes = "";
      }
    });
  }
  
  editEquivCourse(content, localCourse, foreignCourse){
    console.log("editEquivCourse()");
    console.log(localCourse);
    console.log(foreignCourse);
    
    //check if user has permission
    var currentUserID = this.auth.UserID;
    if(localCourse.LockedBy != null && localCourse.LockedBy !== currentUserID && !this.auth.isAdmin()){
      alert("You don't have permission to edit this equivalency. Contact " + localCourse.LockedByUser + " or an Admin to edit it.");
      return;
    }
    
    this.dialogCourse = foreignCourse;
    this.dialogLocalCourse = localCourse;
    this.dialogInputs.Status = {'Status': localCourse.Status};
    this.dialogInputs.Lock = localCourse.LockedBy != null;
    this.dialogInputs.Notes = localCourse.Notes;
    
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
          
          result4.EquivID = localCourse.EquivID;
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
            localCourse.Status = result4.Status;
            localCourse.LockedBy = lockedBy;
            localCourse.LockedByUser = lockedByUser;
            localCourse.Notes = result4.Notes;
            this.foreignCourseService.editEquivCourse(result4);
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
    var currentUserID = this.auth.UserID;
    if(foreignCourse.LockedBy != null && foreignCourse.LockedBy !== currentUserID && !this.auth.isAdmin){
      alert("You don't have permission to delete this equivalency. Contact " + foreignCourse.LockedByUser + " or an Admin to delete it.");
      return;
    }
    
    foreignCourse.LocalCourses = foreignCourse.LocalCourses.filter(lc => 
      lc.LocalCourseName !== localCourse.LocalCourseName
    );
    localCourse.ForeignCourseID = foreignCourse.ForeignCourseID;
    this.foreignCourseService.deleteEquivCourse(localCourse);
  }
  
  //typeaheads
  searchLocalCourse = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : localCoursesGlobal.filter(v => contains(v.LocalCourseName, term)).slice(0, 10));
        
  formatterLocalCourse = (x: LocalCoursePlain) => x.LocalCourseName;
  
  searchStatus = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : statusesGlobal.filter(v => contains(v.Status, term)).slice(0, 10));
        
  formatterStatus = (x: Status) => x.Status
  
  //school typeahead - edit course
  searchSchool3 = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
          : schoolsGlobal.filter(v => contains(v.Name, term)).slice(0, 10)
  );

  formatterSchool3 = (x: School) => x.Name;
}


//main component
@Component({
	selector: 'foreign-courses',
	templateUrl: './foreign_courses.html',
  styles: [`
    table { width: 100%; }
  `],
  entryComponents: [ForeignAccordionViewComponent]
})
@NgModule({
  imports: [ForeignAccordionViewComponent],
  entryComponents: [ForeignAccordionViewComponent]
})
export class ForeignCourseComponent implements OnInit {
  currentSchoolSearch: string;
  currentForeignCourseSearch: string;
  
  courses: ForeignCourse3[];
  dialogCourse: ForeignCourse3;

  isAdmin: boolean;
  
  dialogInputs = {
	  Mode: "Add Equivalency",
	  ForeignCourseName: "",
	  Status: "",
	  Notes: ""
  }
	source: LocalDataSource;
  placeholders = {
    ForeignCourseName: "CMPE 200 - Computer Architecture",
    SchoolName: "San Jose State University"
  };
  changes = {
    ForeignCourseName: new Subject<string>(),
    SchoolName: new Subject<string>()
  };
  dialogInputs2 = {
	  Mode: "Add Course",
    School: "",
	  Dept: "",
	  CourseNum: "",
	  CourseTitle: ""
  }
  
	settings = {
    columns: {
      ForeignCourseName: { 
        title: 'Foreign Course',
        type: 'custom',
        renderComponent: ForeignAccordionViewComponent,
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
  constructor(private foreignCourseService: ForeignCourseService,
    private modalService: NgbModal,
    private auth: AuthService) {}

  ngOnInit(): void {
    subscribeChanges(this.changes.ForeignCourseName, (search) => {
      this.currentForeignCourseSearch = search;
      this.source.addFilter({field: 'ForeignCourseName', search: search});
    });
    subscribeChanges(this.changes.SchoolName, (search) => {
      this.currentSchoolSearch = search;
      this.source.addFilter({field: 'SchoolName', search: search});
    });
    
    this.foreignCourseService.getForeignCourses().then(courses => {
      this.courses = courses;
			this.source = new LocalDataSource(this.courses);
    });
    
    statusesGlobal = [{'Status': 'Accepted'}, {'Status': 'Rejected'}];
    this.foreignCourseService.getSchools().then(schools => {
      schoolsGlobal = schools;
    });
    this.foreignCourseService.getLocalCoursesPlain().then(localCourses => {
      localCoursesGlobal = localCourses;
    });
    this.foreignCourseService.getForeignCoursesSchools().then(foreignCoursesSchools => {
      foreignCoursesSchoolsGlobal = foreignCoursesSchools;
    });
    
    foreignCourseComponentGlobal = this;
    this.currentSchoolSearch = "";
    this.currentForeignCourseSearch = "";

    this.isAdmin = this.auth.isAdmin();
  }
  
  addForeignCourse(content){
    this.modalService.open(content).result.then(result => {
      console.log(result);
      if(result === "Close"){
        console.log("Closed, don't add");
      }else{
        if(result.School == null || result.Dept == null || result.CourseNum == null || result.CourseTitle == null){
          console.log("null check, don't add");
        }else{
          result.Dept = result.Dept.trim().toUpperCase();
          result.CourseNum = result.CourseNum.trim();
          result.CourseTitle = result.CourseTitle.trim();
          if(result.School.Name != null) result.School = result.School.Name;
          else result.School = result.School.trim();
          
          if(result.School === "" || result.Dept === "" || result.CourseNum === "" || result.CourseTitle === ""){
            console.log("empty check, don't add");
          }else{
            var courseName = result.Dept + " " + result.CourseNum + " - " + result.CourseTitle;
            
            var found1 = false;
            for(var i = 0; i < schoolsGlobal.length && !found1; ++i){
              if(schoolsGlobal[i].Name === result.School){
                found1 = true;
                result.SchoolID = schoolsGlobal[i].SchoolID;
                
                var found2 = false;
                for(var i = 0; i < foreignCoursesSchoolsGlobal.length && !found2; ++i){
                  if(foreignCoursesSchoolsGlobal[i].SchoolName === result.School && foreignCoursesSchoolsGlobal[i].ForeignCourseName === courseName){
                    alert("That course already exists. Refresh and try again.");
                    found2 = true;
                  }
                }
                if(!found2){
                  console.log("send results to database");
                  var newForeignCourse: ForeignCourse3 = {
                    ForeignCourseID: -1,
                    ForeignCourseDept: result.Dept,
                    ForeignCourseNum: result.CourseNum,
                    ForeignCourseTitle: result.CourseTitle,
                    ForeignCourseName: result.Dept + " " + result.CourseNum + " - " + result.CourseTitle,
                    SchoolID: result.SchoolID,
                    SchoolName: result.School,
                    LocalCourses: Array<LocalCourse3>()
                  };
                  var newForeignCourseSchool: ForeignCourseSchool = {
                    ForeignCourseID: -1,
                    ForeignCourseName: result.Dept + " " + result.CourseNum + " - " + result.CourseTitle,
                    SchoolID: result.SchoolID,
                    SchoolName: result.School
                  };
                  this.foreignCourseService.addForeignCourse(result).then(http => {
                    newForeignCourse.ForeignCourseID = http.stmt.lastID;
                    this.courses.push(newForeignCourse);
                    this.courses.sort((c1, c2) => {
                      if(c1.SchoolName > c2.SchoolName) return 1;
                      if(c1.SchoolName < c2.SchoolName) return -1;
                      
                      if(c1.ForeignCourseName > c2.ForeignCourseName) return 1;
                      if(c1.ForeignCourseName < c2.ForeignCourseName) return -1;
                      return 0;
                    });
                    this.source = new LocalDataSource(this.courses);
                    this.source.addFilter({field: 'ForeignCourseName', search: this.currentForeignCourseSearch});
                    this.source.addFilter({field: 'SchoolName', search: this.currentSchoolSearch});
                    
                    newForeignCourseSchool.ForeignCourseID = http.stmt.lastID;
                    foreignCoursesSchoolsGlobal.push(newForeignCourseSchool);
                    foreignCoursesSchoolsGlobal.sort((c1, c2) => {
                      if(c1.SchoolName > c2.SchoolName) return 1;
                      if(c1.SchoolName < c2.SchoolName) return -1;
                      
                      if(c1.ForeignCourseName > c2.ForeignCourseName) return 1;
                      if(c1.ForeignCourseName < c2.ForeignCourseName) return -1;
                      return 0;
                    });
                  });
                }
              }
            }
            if(!found1){
              alert("School (" + result.School + ") was not found. If you believe that this is an error, refresh and try again.");
            }
          }
        }
        result.School = {'Name': ''};
        result.Dept = '';
        result.CourseNum = '';
        result.CourseTitle = '';
      }
    });
  }
  
  editForeignCourse(foreignCourse){
    var found1 = false;
    for(var i = 0; i < this.courses.length && !found1; ++i){
      if(this.courses[i].ForeignCourseID === foreignCourse.ForeignCourseID){
        found1 = true;
        this.courses[i].ForeignCourseDept = foreignCourse.ForeignCourseDept;
        this.courses[i].ForeignCourseNum = foreignCourse.ForeignCourseNum;
        this.courses[i].ForeignCourseTitle = foreignCourse.ForeignCourseTitle;
        this.courses[i].ForeignCourseName = foreignCourse.ForeignCourseName;
        this.courses[i].SchoolID = foreignCourse.SchoolID;
        this.courses[i].SchoolName = foreignCourse.SchoolName;
        
        this.courses.sort((c1, c2) => {
          if(c1.SchoolName > c2.SchoolName) return 1;
          if(c1.SchoolName < c2.SchoolName) return -1;
          
          if(c1.ForeignCourseName > c2.ForeignCourseName) return 1;
          if(c1.ForeignCourseName < c2.ForeignCourseName) return -1;
          return 0;
        });
        this.source = new LocalDataSource(this.courses);
        this.source.addFilter({field: 'ForeignCourseName', search: this.currentForeignCourseSearch});
        this.source.addFilter({field: 'SchoolName', search: this.currentSchoolSearch});
      }
    }
    if(!found1){
      console.log("error. didnt find course to edit");
    }
    
    var found2 = false;
    for(var i = 0; i < foreignCoursesSchoolsGlobal.length && !found2; ++i){
      if(foreignCoursesSchoolsGlobal[i].ForeignCourseID === foreignCourse.ForeignCourseID){
        found2 = true;
        foreignCoursesSchoolsGlobal[i].SchoolID = foreignCourse.SchoolID;
        foreignCoursesSchoolsGlobal[i].SchoolName = foreignCourse.SchoolName;
        
        foreignCoursesSchoolsGlobal.sort((c1, c2) => {
          if(c1.SchoolName > c2.SchoolName) return 1;
          if(c1.SchoolName < c2.SchoolName) return -1;
          
          if(c1.ForeignCourseName > c2.ForeignCourseName) return 1;
          if(c1.ForeignCourseName < c2.ForeignCourseName) return -1;
          return 0;
        });
      }
    }
    if(!found2){
      console.log("error. didnt find foreignCourse/school combo");
    }
  }
  
  deleteForeignCourse(course){
    this.courses = this.courses.filter(fc => fc.ForeignCourseName !== course.ForeignCourseName);
    this.source = new LocalDataSource(this.courses);
    subscribeChanges(this.changes.ForeignCourseName, (search) => {
      this.source.addFilter({field: 'ForeignCourseName', search: search});
      this.currentForeignCourseSearch = search;
    });
    this.source.addFilter({field: 'ForeignCourseName', search: this.currentForeignCourseSearch});
    this.source.addFilter({field: 'SchoolName', search: this.currentSchoolSearch});
    
    foreignCoursesSchoolsGlobal = foreignCoursesSchoolsGlobal.filter(fcs => fcs.ForeignCourseName !== course.ForeignCourseName);
  }
  
  containsEquivalency(localCourseID, foreignCourseID){
    var found = false;
    for(var i = 0; i < this.courses.length && !found; ++i){
      if(this.courses[i].ForeignCourseID === foreignCourseID){
        found = true;
        for(var j = 0; j < this.courses[i].LocalCourses.length; ++j){
          if(this.courses[i].LocalCourses[j].LocalCourseID === localCourseID){
            return true;
          }
        }
      }
    }
    return false;
  }
  
  //school typeahead
  searchSchool = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
          : schoolsGlobal.filter(v => contains(v.Name, term)).slice(0, 10)
  );

  formatterSchool = (x: School) => x.Name;
  
  //school typeahead - add course
  searchSchool2 = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
          : schoolsGlobal.filter(v => contains(v.Name, term)).slice(0, 10)
  );

  formatterSchool2 = (x: School) => x.Name;

  //foreign courses typeahead
  searchForeignCourse = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
          : foreignCoursesSchoolsGlobal.filter(v => contains(v.ForeignCourseName, term) && contains(v.SchoolName, this.currentSchoolSearch)).slice(0, 10)
  );

  formatterForeignCourse = (x: ForeignCourseSchool) => x.ForeignCourseName;
}
