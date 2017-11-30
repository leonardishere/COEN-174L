import { Component, OnInit, Input, Output, EventEmitter, NgModule } from '@angular/core';
import { LocalCourse2 } from './../models/local_course2';
import { ForeignCourse2 } from './../models/foreign_course2';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import { Ng2SmartTableModule, LocalDataSource, ViewCell } from 'ng2-smart-table';
import { LocalCourseService } from './../services/local_courses';
import { AuthService } from '../services/auth.service';
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
var openModalGlobal: any;

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
  isAdmin: boolean;
  
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
    private modalService: NgbModal,
    private auth: AuthService) { }
    
  ngOnInit(){
    this.course = this.value;
    this.dialogCourse = this.rowData;
    
    subscribeChanges(this.changes.SchoolName, (search) => {
      this.currentSchool = search;
    });
    
    this.currentSchool = '';
    this.isAdmin = localCourseComponentGlobal.isAdmin;
  }
  
  //open add equiv course modal
  addEquivCourse(content, course){
    this.dialogInputs.Mode = "Add";
    this.dialogCourse = course;
    openModalGlobal = this.modalService.open(content);
    openModalGlobal.result.catch(err => {});
  }
  
  //submit from add equiv course modal
  addEquivCourseSubmit(result, status){    
    if(status === "add"){
      result.LocalCourseID = this.dialogCourse.LocalCourseID;
      
      //add to display
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
        result.LockedBy = this.auth.UserID;
        result3.LockedBy = this.auth.UserID;
        result3.LockedByUser = ""+this.auth.Name;
        result4.LockedBy = this.auth.UserID;
      }else{
        result.LockedBy = -1;
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
        alert("Values cannot be left empty. Try again.");
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
              for(var j = 0; j < this.dialogCourse.ForeignCourses.length && !found2; ++j){
                if(this.dialogCourse.ForeignCourses[j].ForeignCourseID === result4.ForeignCourseID){
                  found2 = true;
                  alert("That equivalency already exists. Refresh and try again.");
                }
              }
              if(!found2){
                this.localCourseService.addEquivCourse(result4)
                .then(promise => {
                  result4.EquivID = promise.row;
                  result3.EquivID = promise.row;
                })
                .catch(err => console.log(err));
                this.dialogCourse.ForeignCourses.push(result3);
                this.dialogCourse.ForeignCourses.sort((c1, c2) => {
                  if(c1.SchoolName > c2.SchoolName) return 1;
                  if(c1.SchoolName < c2.SchoolName) return -1;
                    
                  if(c1.ForeignCourseName > c2.ForeignCourseName) return 1;
                  if(c1.ForeignCourseName < c2.ForeignCourseName) return -1;
                  return 0;
                });
                openModalGlobal.close();
                openModalGlobal = null;
                result.SchoolName = "";
                result.ForeignCourseName= "";
                result.Status = "";
                result.Lock = false;
                result.Notes = "";
              }
            }
          }
        }
        if(!found){
          alert("School (" + result3.SchoolName + ") and foreign course (" + result3.ForeignCourseName + ") combination was not found. Refresh and try again.");
        }
      }
          
    }else{
      openModalGlobal.close();
      openModalGlobal = null;
      result.SchoolName = "";
      result.ForeignCourseName= "";
      result.Status = "";
      result.Lock = false;
      result.Notes = "";
    }
  }
  
  //open edit equiv course modal
  editEquivCourse(content, localCourse, foreignCourse){
    //check if user has permission
    var currentUserID = this.auth.UserID;
    if(foreignCourse.LockedBy != null && foreignCourse.LockedBy !== currentUserID && !this.auth.isAdmin()){
      alert("You don't have permission to edit this equivalency. Contact " + foreignCourse.LockedByUser + " or an Admin to edit it.");
      return;
    }
    
    this.dialogCourse = localCourse;
    this.dialogForeignCourse = foreignCourse;
    this.dialogInputs.Status = {'Status': foreignCourse.Status};
    this.dialogInputs.Lock = foreignCourse.LockedBy != null;
    this.dialogInputs.Notes = foreignCourse.Notes;
    
    openModalGlobal = this.modalService.open(content);
    openModalGlobal.result.catch(err => {});
  }
  
  //submit from edit equiv course modal
  editEquivCourseSubmit(result, status){
    if(status === "edit"){
      //add to database
      var result4: EquivCourse = {EquivID: -1, LocalCourseID: -1, ForeignCourseID: -1, Status: '', LockedBy: -1, Notes: ''};
      result4.Notes = result.Notes.trim();
      result4.LocalCourseID = result.LocalCourseID;
      
      result4.EquivID = this.dialogForeignCourse.EquivID;
      result4.LocalCourseID = this.dialogCourse.LocalCourseID;
      result4.ForeignCourseID = this.dialogForeignCourse.ForeignCourseID;
      
      var lockedBy = -1;
      var lockedByUser = '';

      if(result.Lock){
        result.LockedBy = this.auth.UserID;
        lockedBy = this.auth.UserID;
        lockedByUser = ""+this.auth.Name;
        result4.LockedBy = this.auth.UserID;
      }else{
        result.LockedBy = -1;
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
        this.dialogForeignCourse.Status = result4.Status;
        this.dialogForeignCourse.LockedBy = lockedBy;
        this.dialogForeignCourse.LockedByUser = lockedByUser;
        this.dialogForeignCourse.Notes = result4.Notes;
        this.localCourseService.editEquivCourse(result4)
        .then(http => {
          openModalGlobal.close();
          openModalGlobal = null;
          result.SchoolName = "";
          result.ForeignCourseName= "";
          result.Status = "";
          result.Lock = false;
          result.Notes = "";
        })
        .catch(err => console.log(err));
      }
    }else{
      openModalGlobal.close();
      openModalGlobal = null;
      result.SchoolName = "";
      result.ForeignCourseName= "";
      result.Status = "";
      result.Lock = false;
      result.Notes = "";
    }
  }
  
  //delete the equiv course
  deleteEquivCourse(localCourse, foreignCourse) {
    //check if user has permission
    var currentUserID = this.auth.UserID;
    if(foreignCourse.LockedBy != null && foreignCourse.LockedBy !== currentUserID && !this.auth.isAdmin()){
      alert("You don't have permission to delete this equivalency. Contact " + foreignCourse.LockedByUser + " or an Admin to delete it.");
      return;
    }
    
    localCourse.ForeignCourses = localCourse.ForeignCourses.filter(fc =>
	    fc.ForeignCourseName !== foreignCourse.ForeignCourseName
    );
    foreignCourse.LocalCourseID = localCourse.LocalCourseID;
    this.localCourseService.deleteEquivCourse(foreignCourse);
  }
   
  //open edit local course modal
  editLocalCourse(event, content, localCourse){
    event.preventDefault();
    event.stopPropagation();
    
    //check if user has permission
    var currentUserID = this.auth.UserID;
    if(!this.auth.isAdmin()){
      alert("You don't have permission to edit courses. Contact an Admin to edit it.");
      return;
    }
    
    this.dialogInputs2.Name = localCourse.LocalCourseName;
    this.dialogInputs2.Dept = localCourse.LocalCourseDept;
    this.dialogInputs2.LocalCourseID = localCourse.LocalCourseID;
    this.dialogInputs2.CourseNum = localCourse.LocalCourseNum;
    this.dialogInputs2.CourseTitle = localCourse.LocalCourseTitle;
    
    openModalGlobal = this.modalService.open(content);
    openModalGlobal.result.catch(err => {});
  }
  
  //submit from edit local course modal
  editLocalCourseSubmit(result, status){
    if(status === "edit"){
      result.Dept = result.Dept.trim().toUpperCase();
      result.CourseNum = result.CourseNum.trim();
      result.CourseTitle = result.CourseTitle.trim();
      
      if(result.Dept === "" || result.CourseNum === "" || result.CourseTitle === ""){
        alert("Values cannot be left empty. Try again.");
      }else{
        var courseName = result.Dept + " " + result.CourseNum + " - " + result.CourseTitle;
        var found = false;
        for(var i = 0; i < localCoursesGlobal.length && !found; ++i){
          if(localCoursesGlobal[i].LocalCourseName === courseName && localCoursesGlobal[i].LocalCourseID !== result.LocalCourseID){
            found = true;
            alert("That course exists already. Refresh and try again.");
          }
        }
        if(!found){
          var result2 = {LocalCourseID: this.dialogCourse.LocalCourseID, Dept: result.Dept, CourseNum: result.CourseNum, CourseTitle: result.CourseTitle};
          this.localCourseService.editLocalCourse(result2)
          .then(http => {
            this.dialogCourse.LocalCourseDept = result2.Dept;
            this.dialogCourse.LocalCourseNum = result2.CourseNum;
            this.dialogCourse.LocalCourseTitle = result2.CourseTitle;
            this.dialogCourse.LocalCourseName = courseName;
            
            var found1 = false;
            for(var i = 0; i < localCoursesGlobal.length && !found1; ++i){
              if(localCoursesGlobal[i].LocalCourseID === result2.LocalCourseID){
                found1 = true;
                localCoursesGlobal[i].LocalCourseName = courseName
              }
            }
            localCoursesGlobal.sort((c1, c2) => {
              if(c1.LocalCourseName > c2.LocalCourseName) return 1;
              if(c1.LocalCourseName < c2.LocalCourseName) return -1;
              return 0;
            });
            localCourseComponentGlobal.editLocalCourse(result2);
          })
          .catch(err => {
            console.log(err);
          });
          openModalGlobal.close();
          openModalGlobal = null;
          result.Name = "";
          result.Dept = "";
          result.CourseNum = "";
          result.CourseTitle = "";
          result.LocalCourseID = -1;
        }
      }
    }else{
      openModalGlobal.close();
      openModalGlobal = null;
      result.Name = "";
      result.Dept = "";
      result.CourseNum = "";
      result.CourseTitle = "";
      result.LocalCourseID = -1;
    }
  }
  
  //delete the local course
  deleteLocalCourse(event, localCourse){
    event.preventDefault();
    event.stopPropagation();
    
    //check if user has permission
    var currentUserID = this.auth.UserID;
    if(!this.auth.isAdmin()){
      alert("You don't have permission to delete courses. Contact an Admin to delete it.");
      return;
    }
    
    this.localCourseService.deleteLocalCourse(localCourse);
    localCourseComponentGlobal.deleteLocalCourse(localCourse);
    localCoursesGlobal = localCoursesGlobal.filter(lc => 
      lc.LocalCourseName !== localCourse.LocalCourseName
    );      
  }
  
  //school typeahead
  searchSchool = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : schoolsGlobal.filter(v => contains(v.Name, term)).slice(0, 10));
  
  formatterSchool = (x: School) => x.Name;
  
  //foreign course typeahead
  searchForeignCourse = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : foreignCoursesSchoolsGlobal.filter(v => contains(v.ForeignCourseName, term) && contains(v.SchoolName, this.currentSchool)).slice(0, 10));
        
  formatterForeignCourse = (x: ForeignCourseSchool) => x.ForeignCourseName;
  
  //status typeahead
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
  isAdmin: boolean;
  
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
    private modalService: NgbModal,
    private auth: AuthService) { }

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

    this.isAdmin = this.auth.isAdmin();
    
    openModalGlobal = null;
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

  //open add local course modal
  addLocalCourse(content){
	  this.dialogInputs2.Mode = "Add";
    openModalGlobal = this.modalService.open(content);
    openModalGlobal.result.catch(err => {});
  }

  //submit from add local course modal
  addLocalCourseSubmit(result, status){
    if(status === "add"){
      result.Dept = result.Dept.trim().toUpperCase();
      result.CourseNum = result.CourseNum.trim();
      result.CourseTitle = result.CourseTitle.trim();
      if(result.Dept === "" || result.CourseNum === "" || result.CourseTitle === ""){
        alert("Values cannot be left empty. Try again.");
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
            result.Dept = "";
            result.CourseNum = "";
            result.CourseTitle = "";
          })
          .catch(err => console.log(err));
          
          openModalGlobal.close();
          openModalGlobal = null;
        }
      }
    }else{
      openModalGlobal.close();
      openModalGlobal = null;
      result.Dept = "";
      result.CourseNum = "";
      result.CourseTitle = "";
    }
  }
  
  //edit the local course
  editLocalCourse(course){
    var found = false;
    for(var i = 0; i < this.courses.length && !found; ++i){
      if(this.courses[i].LocalCourseID === course.LocalCourseID){
        found = true;
        this.courses[i].LocalCourseDept = course.Dept;
        this.courses[i].LocalCourseNum = course.CourseNum;
        this.courses[i].LocalCourseTitle = course.CourseTitle;
        this.courses[i].LocalCourseName = course.Dept + " " + course.CourseNum + " - " + course.CourseTitle;
      }
    }
    if(found){
      this.courses.sort((c1, c2) => {
        if(c1.LocalCourseName > c2.LocalCourseName) return 1;
        if(c1.LocalCourseName < c2.LocalCourseName) return -1;
        return 0;
      });
      this.source = new LocalDataSource(this.courses);
      this.source.addFilter({field: 'LocalCourseName', search: this.currentLocalCourseSearch});
    }
  }
  
  //delete the local course
  deleteLocalCourse(course){
    this.courses = this.courses.filter(lc =>
      lc.LocalCourseName !== course.LocalCourseName
    );
    this.courses.sort((c1, c2) => {
      if(c1.LocalCourseName > c2.LocalCourseName) return 1;
      if(c1.LocalCourseName < c2.LocalCourseName) return -1;
      return 0;
    });
    this.source = new LocalDataSource(this.courses);
    this.source.addFilter({field: 'LocalCourseName', search: this.currentLocalCourseSearch});
  }
}
