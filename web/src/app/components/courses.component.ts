import { Component, OnInit } from '@angular/core';
import { LocalCourse } from './../models/local_course';
import { CourseService } from './../services/course.service';
/* CoursesComponent */
@Component({
selector: 'local-courses',
  template: `
  <h1>Courses </h1>
  <p>unneeded page, use Local Courses</p>
  <ul class="list-group">
    <li *ngFor="let course of courses"
      class="list-group-item"
      (click)="onSelect(course)">
      <span>{{course.LocalCourseName}}</span> / 
      <span>{{course.ForeignCourseName}}</span>
    </li>
  </ul>
  `,
  styles: [``]
})
export class CoursesComponent implements OnInit {
  courses: LocalCourse[];

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.courseService.getLocalCourses().then(courses =>
      this.courses = courses
    );
  }

  onSelect(course: LocalCourse): void {
    console.log('Selected', course);
  }
}
