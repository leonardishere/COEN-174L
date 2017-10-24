import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { CourseService } from './services/course.service';
import { EquivCourseService } from './services/equiv_courses';
import { LocalCourseService } from './services/local_courses';
import { UserService } from './services/users';
import { ChangeService } from './services/changes';

import { AppComponent } from './app.component';
import { CoursesComponent } from './components/courses.component';
import { EquivCoursesComponent } from './components/equiv_courses';
import { LocalCoursesComponent } from './components/local_courses';
import { UserComponent } from './components/users';
import { ChangeComponent } from './components/changes';

@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
	EquivCoursesComponent,
	LocalCoursesComponent,
	UserComponent,
	ChangeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [CourseService, EquivCourseService, LocalCourseService, UserService, ChangeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
