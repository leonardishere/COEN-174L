import { Component, OnInit } from '@angular/core';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { LocalCourseJoined } from './../models/local_course_joined';
import { LocalCourseService } from './../services/local_courses';

@Component({
	selector: 'local-courses',
	template: `
		<h1>Local Courses</h1>
		<ng2-smart-table
			[settings]="settings"
			[source]="source">
		</ng2-smart-table>
	`,
	styles: [``]
})
export class LocalCoursesComponent implements OnInit {
  courses: LocalCourseJoined[];
	source: LocalDataSource;
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
  constructor(private localCourseService: LocalCourseService) { }

  ngOnInit(): void {
    this.localCourseService.getLocalCourses().then(courses => {
      this.courses = courses;
			this.source = new LocalDataSource(this.courses);
    });
  }

  onSelect(course: LocalCourseJoined): void {
    console.log('Selected', course);
  }
}
