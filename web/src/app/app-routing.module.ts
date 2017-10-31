import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login.component';
import { CoursesComponent } from './components/courses.component';
import { EquivCoursesComponent } from './components/equiv_courses';
import { LocalCoursesComponent } from './components/local_courses';
import { UserComponent } from './components/users';
import { ChangeComponent } from './components/changes';
import { SchoolComponent } from './components/schools';
import { ForeignCourseComponent } from './components/foreign_courses';

const routes: Routes = [
  { path: '', redirectTo: '/equiv_courses', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'equiv_courses', component: EquivCoursesComponent },
  { path: 'local_courses', component: LocalCoursesComponent },
  { path: 'users', component: UserComponent},
  { path: 'changes', component: ChangeComponent},
  { path: 'schools', component: SchoolComponent},
  { path: 'foreign_courses', component: ForeignCourseComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true } ) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
