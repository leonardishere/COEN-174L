import { Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { EquivCourseJoined } from '../models/equiv_course_joined';
import { EquivCourseService } from './../services/equiv_courses';
import { subscribeChanges, contains } from '../utils';

@Component({
selector: 'equiv-courses',
  template: `
	<h1>Equivalent Courses</h1>
  
  <!-- form -->
	<form>
		Local Course:<br>
    
    <input #LocalCourse
      type="text"
      name="LocalCourseName"
      placeholder="{{placeholders.LocalCourseName}}"
      (input)="changes.LocalCourseName.next(LocalCourse.value)">
    <!--
    <div class="form-group">
      <label for="localCourse">Course Title:</label>
      <input id="localCourse" type="text" class="form-control" [(ngModel)]="dialogInputs.ForeignCourseName" [ngbTypeahead]="search2" [ngModelOptions]="{standalone: true}" />
    </div>
    -->
		<br>
		School Name:<br>
    <input #School
      type="text"
      name="SchoolName"
      placeholder="{{placeholders.SchoolName}}"
      (input)="changes.SchoolName.next(School.value)">
		<br>
		Foreign Course:<br>
    <input #ForeignCourse
      id="ForeignCourseNameBox"
      type="text"
      name="ForeignCourseName"
      placeholder="{{placeholders.ForeignCourseName}}"
      (input)="changes.ForeignCourseName.next(ForeignCourse.value)">
		<br><br>
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
  courses: EquivCourseJoined[];
  source: LocalDataSource;
  placeholders = {
    LocalCourseName: "COEN 210 - Computer Architecture",
    SchoolName: "San Jose State University",
    ForeignCourseName: "CMPE 200 - Computer Architecture"
  };
  changes = {
    LocalCourseName: new Subject<string>(),
    SchoolName: new Subject<string>(),
    ForeignCourseName: new Subject<string>()
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
    });
    subscribeChanges(this.changes.ForeignCourseName, (search) => {
      this.source.addFilter({field: 'ForeignCourseName', search: search});
    });
  }

  onSelect(course: EquivCourseJoined): void {
    console.log('Selected', course);
  }
}
