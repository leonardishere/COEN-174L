import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoursesComponent } from './courses.component';
import { EquivCoursesComponent } from './courses.component';
import { LocalCoursesComponent } from './courses.component';
import { UserComponent } from './courses.component';
import { ChangeComponent } from './courses.component';

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
