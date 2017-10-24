import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { CourseService } from './course.service';
import { EquivCourseService } from './course.service';
import { LocalCourseService } from './course.service';
import { UserService } from './course.service';
import { ChangeService } from './course.service';

import { AppComponent } from './app.component';
import { CoursesComponent } from './courses.component';
import { EquivCoursesComponent } from './courses.component';
import { LocalCoursesComponent } from './courses.component';
import { UserComponent } from './courses.component';
import { ChangeComponent } from './courses.component';

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
