import { Component, OnInit } from '@angular/core';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { ForeignCourseJoined } from './../models/foreign_course_joined';
import { ForeignCourseService } from './../services/foreign_courses';

@Component({
	selector: 'foreign-courses',
	template: `
		<h1>Foreign Courses</h1>
		<ng2-smart-table
			[settings]="settings"
			[source]="source">
		</ng2-smart-table>
	`,
	styles: [``]
})
export class ForeignCourseComponent implements OnInit {
  courses: ForeignCourseJoined[];
	source: LocalDataSource;
	settings = {
    columns: {
      ForeignCourseName: { title: 'Foreign Course' },
      SchoolName: { title: 'School' },
      LocalCourseName: { title: 'Local Course' },
			Status: { title: 'Status' }
    },
		pager: {
			perPage: 100
		}
  };
  constructor(private foreignCourseService: ForeignCourseService) { }

  ngOnInit(): void {
    this.foreignCourseService.getForeignCourses().then(courses => {
      this.courses = courses;
			this.source = new LocalDataSource(this.courses);
    });
  }

  onSelect(course: ForeignCourseJoined): void {
    console.log('Selected', course);
  }
}
