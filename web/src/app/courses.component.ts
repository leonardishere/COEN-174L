import { Component, OnInit } from '@angular/core';
import { LocalCourse } from './models/local_course';
import { CourseService } from './course.service';

@Component({
selector: 'local-courses',
  template: `
  <h1>Courses </h1>
  <ul>
    <li *ngFor="let course of courses"
      (click)="onSelect(course)">
      <span>{{course.Department}}</span>
      <span>{{course.CourseNum}}</span>:
      <span>{{course.Title}}</span>
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
