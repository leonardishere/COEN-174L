import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoursesComponent } from './components/courses.component';
import { EquivCoursesComponent } from './components/equiv_courses';
import { LocalCoursesComponent } from './components/local_courses';
import { UserComponent } from './components/users';
import { ChangeComponent } from './components/changes';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'courses', component: CoursesComponent },
  { path: 'equiv_courses', component: EquivCoursesComponent },
  { path: 'local_courses', component: LocalCoursesComponent },
  { path: 'users', component: UserComponent},
  { path: 'changes', component: ChangeComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
