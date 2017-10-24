import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { CourseService } from './services/course.service';
import { EquivCourseService } from './services/equiv_courses';
import { LocalCourseService } from './services/local_courses';
import { UserService } from './services/users';
import { ChangeService } from './services/changes';
import { SchoolService } from './services/schools';
import { ForeignCourseService } from './services/foreign_courses';

import { AppComponent } from './app.component';
import { CoursesComponent } from './components/courses.component';
import { EquivCoursesComponent } from './components/equiv_courses';
import { LocalCoursesComponent } from './components/local_courses';
import { UserComponent } from './components/users';
import { ChangeComponent } from './components/changes';
import { SchoolComponent } from './components/schools';
import { ForeignCourseComponent } from './components/foreign_courses';

@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
	EquivCoursesComponent,
	LocalCoursesComponent,
	UserComponent,
	ChangeComponent,
	SchoolComponent,
	ForeignCourseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule
  ],
  providers: [CourseService, EquivCourseService, LocalCourseService, UserService, ChangeService, SchoolService, ForeignCourseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
