import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2Webstorage } from 'ngx-webstorage';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { AppRoutingModule } from './app-routing.module';
import { CourseService } from './services/course.service';
import { EquivCourseService } from './services/equiv_courses';
import { LocalCourseService } from './services/local_courses';
import { UserService } from './services/users';
import { SchoolService } from './services/schools';
import { ForeignCourseService } from './services/foreign_courses';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login.component';
import { CoursesComponent } from './components/courses.component';
import { EquivCoursesComponent } from './components/equiv_courses';
import { LocalCoursesComponent } from './components/local_courses';
import { UserComponent } from './components/users';
import { SchoolComponent } from './components/schools';
import { ForeignCourseComponent } from './components/foreign_courses';

import { AccordionViewComponent } from './components/local_courses_accordion';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CoursesComponent,
    EquivCoursesComponent,
    LocalCoursesComponent,
    UserComponent,
    SchoolComponent,
    ForeignCourseComponent,
    AccordionViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    NgbModule.forRoot(),
    Ng2Webstorage,
    Ng2SmartTableModule
  ],
  providers: [CourseService, EquivCourseService, LocalCourseService, UserService, SchoolService, ForeignCourseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
