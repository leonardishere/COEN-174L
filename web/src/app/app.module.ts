import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2Webstorage } from 'ngx-webstorage';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth_interceptor';
import { AuthGuard } from './auth_guard';

import { AuthService } from './services/auth.service';
import { CourseService } from './services/course.service';
import { EquivCourseService } from './services/equiv_courses';
import { LocalCourseService } from './services/local_courses';
import { UserService } from './services/users';
import { SchoolService } from './services/schools';
import { ForeignCourseService } from './services/foreign_courses';

import { AppComponent } from './app.component';
import { CoursesComponent } from './components/courses.component';
import { EquivCoursesComponent } from './components/equiv_courses';
import { LocalCoursesComponent } from './components/local_courses';
import { UserComponent } from './components/users';
import { SchoolComponent } from './components/schools';
import { ForeignCourseComponent } from './components/foreign_courses';

import { LocalAccordionViewComponent } from './components/local_courses';
import { ForeignAccordionViewComponent } from './components/foreign_courses';

@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
    EquivCoursesComponent,
    LocalCoursesComponent,
    UserComponent,
    SchoolComponent,
    ForeignCourseComponent,
    LocalAccordionViewComponent,
    ForeignAccordionViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule.forRoot(),
    Ng2Webstorage,
    Ng2SmartTableModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    AuthGuard,
    AuthService,
    CourseService,
    EquivCourseService,
    LocalCourseService,
    UserService,
    SchoolService,
    ForeignCourseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
