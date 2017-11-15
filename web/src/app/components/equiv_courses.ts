import { Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { EquivCourseJoined } from '../models/equiv_course_joined';
import { EquivCourseService } from './../services/equiv_courses';
import { subscribeChanges, contains } from '../utils';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { School } from './../models/school';
import { LocalCoursePlain } from './../models/local_course_plain';
import { ForeignCourseSchool } from './../models/foreign_course_school';
import { Status } from './../models/status';

@Component({
selector: 'equiv-courses',
  template: `
	<h1>Equivalent Courses</h1>
  
  <!-- form -->
	<form>
    <div class="form-group">
      <ng-template #rtLocalCourse let-r="result" let-t="term">
        <p>{{r.LocalCourseName}}</p>
      </ng-template>
      <label for="typeahead-LocalCourse">Local Course:</label>
      <input #LocalCourse id="typeahead-LocalCourse" type="text" class="form-control" [ngbTypeahead]="searchLocalCourse" [resultTemplate]="rtLocalCourse" [inputFormatter]="formatterLocalCourse" (input)="changes.LocalCourseName.next(LocalCourse.value)" (selectItem)="changes.LocalCourseName.next($event.item.LocalCourseName)" placeholder="{{placeholders.LocalCourseName}}" [placement]="['bottom-left']"/>
    </div>
    
    <div class="form-group">
      <ng-template #rtSchool let-r="result" let-t="term">
        <p>{{r.Name}}</p>
      </ng-template>
      <label for="typeahead-School">School:</label>
      <input #School id="typeahead-School" type="text" class="form-control" [ngbTypeahead]="searchSchool" [resultTemplate]="rtSchool" [inputFormatter]="formatterSchool" (input)="changes.SchoolName.next(School.value)" (selectItem)="changes.SchoolName.next($event.item.Name)" placeholder="{{placeholders.SchoolName}}"/>
    </div>
    
    <div class="form-group">
      <ng-template #rtForeignCourse let-r="result" let-t="term">
        <p>{{r.ForeignCourseName}}</p>
      </ng-template>
      <label for="typeahead-ForeignCourse">Local Course:</label>
      <input #ForeignCourse id="typeahead-ForeignCourse" type="text" class="form-control" [ngbTypeahead]="searchForeignCourse" [resultTemplate]="rtForeignCourse" [inputFormatter]="formatterForeignCourse" (input)="changes.ForeignCourseName.next(ForeignCourse.value)" (selectItem)="changes.ForeignCourseName.next($event.item.ForeignCourseName)" placeholder="{{placeholders.ForeignCourseName}}"/>
    </div>
    
    <div class="form-group">
      <ng-template #rtStatus let-r="result" let-t="term">
        <p>{{r.Status}}</p>
      </ng-template>
      <label for="typeahead-Status">Status:</label>
      <input #Status id="typeahead-Status" type="text" class="form-control" [ngbTypeahead]="searchStatus" [resultTemplate]="rtStatus" [inputFormatter]="formatterStatus" (input)="changes.Status.next(Status.value)" (selectItem)="changes.Status.next($event.item.Status)" placeholder="{{placeholders.Status}}"/>
    </div>
	</form>
  
  <!-- table -->
  <ng2-smart-table
    [settings]="settings"
    [source]="source">
  </ng2-smart-table>
  `,
  styles: [`
    input {
      width: 500px;
    }
  `]
})
export class EquivCoursesComponent {
  schools: School[];
  localCourses: LocalCoursePlain[];
  foreignCourses: ForeignCourseSchool[];
  statuses: Status[];
  currentSchool: string;
  
  courses: EquivCourseJoined[];
  source: LocalDataSource;
  placeholders = {
    LocalCourseName: "COEN 210 - Computer Architecture",
    SchoolName: "San Jose State University",
    ForeignCourseName: "CMPE 200 - Computer Architecture",
    Status: "Accepted"
  };
  changes = {
    LocalCourseName: new Subject<string>(),
    SchoolName: new Subject<string>(),
    ForeignCourseName: new Subject<string>(),
    Status: new Subject<string>()
  };
  settings = {
    columns: {
      LocalCourseName: { title: 'Local Course' },
      ForeignCourseName: { title: 'Foreign Course' },
      SchoolName: { title: 'School' },
      Status: { title: 'Status'}
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

  constructor(private equivCourseService: EquivCourseService) { }

  ngOnInit(): void {
	  this.equivCourseService.getEquivCourses().then(courses => {
	    this.courses = courses;
      this.source = new LocalDataSource(this.courses);
    });

    subscribeChanges(this.changes.LocalCourseName, (search) => {
      this.source.addFilter({field: 'LocalCourseName', search: search});
    });
    subscribeChanges(this.changes.SchoolName, (search) => {
      this.source.addFilter({field: 'SchoolName', search: search});
      this.currentSchool = search;
    });
    subscribeChanges(this.changes.ForeignCourseName, (search) => {
      this.source.addFilter({field: 'ForeignCourseName', search: search});
    });
    subscribeChanges(this.changes.Status, (search) => {
      this.source.addFilter({field: 'Status', search: search});
    });
    
    this.currentSchool = "";
    
    this.equivCourseService.getSchools().then(schools => {
      this.schools = schools;
    });
    
    this.equivCourseService.getLocalCoursesPlain().then(localCourses => {
      this.localCourses = localCourses;
    });
    
    this.equivCourseService.getForeignCoursesSchools().then(foreignCoursesSchools => {
      this.foreignCourses = foreignCoursesSchools;
    });
    
    this.statuses = [{'Status': 'Accepted'}, {'Status': 'Rejected'}];
  }
  
  //local courses typeahead
  searchLocalCourse = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
          : this.localCourses.filter(v => contains(v.LocalCourseName, term)).slice(0, 10)
  );
  
  formatterLocalCourse = (x: {LocalCourseName: string}) => x.LocalCourseName;
  
  //school typeahead
  searchSchool = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
          : this.schools.filter(v => contains(v.Name, term)).slice(0, 10)
  );
  
  formatterSchool = (x: {Name: string}) => x.Name;
  
  //foreign courses typeahead
  searchForeignCourse = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
          : this.foreignCourses.filter(v => contains(v.ForeignCourseName, term) && contains(v.SchoolName, this.currentSchool)).slice(0, 10)
  );
  
  formatterForeignCourse = (x: {ForeignCourseName: string}) => x.ForeignCourseName;
  
  //status typeahead
  searchStatus = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
          : this.statuses.filter(v => contains(v.Status, term)).slice(0, 10)
  );
  
  formatterStatus = (x: {Status: string}) => x.Status;
}
