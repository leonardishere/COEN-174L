import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoursesComponent } from './components/courses.component';
import { EquivCoursesComponent } from './components/equiv_courses';
import { LocalCoursesComponent } from './components/local_courses';
import { UserComponent } from './components/users';
import { ChangeComponent } from './components/changes';
import { SchoolComponent } from './components/schools';
import { ForeignCourseComponent } from './components/foreign_courses';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'courses', component: CoursesComponent },
  { path: 'equiv_courses', component: EquivCoursesComponent },
  { path: 'local_courses', component: LocalCoursesComponent },
  { path: 'users', component: UserComponent},
  { path: 'changes', component: ChangeComponent},
  { path: 'schools', component: SchoolComponent},
  { path: 'foreign_courses', component: ForeignCourseComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
