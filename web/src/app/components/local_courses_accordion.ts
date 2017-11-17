import { Component, OnInit, Input, Output, EventEmitter, NgModule } from '@angular/core';
import { LocalCourse2 } from './../models/local_course2';
import { LocalCourse2Wrapper } from './../models/local_course2_wrapper';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import { Ng2SmartTableModule, LocalDataSource, ViewCell } from 'ng2-smart-table';
import { LocalCourseService } from './../services/local_courses';
import { subscribeChanges, contains } from '../utils';

//import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { School } from './../models/school';
import { LocalCoursePlain } from './../models/local_course_plain';
//import { ViewCell } from '../../../../ng2-smart-table';

//these werent required earlier
import { NgbAccordion, NgbPanel } from '@ng-bootstrap/ng-bootstrap/accordion/accordion';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion/accordion.module';

@Component({
  selector: 'accordion-view',
  template: `
    <!--
    <ngb-accordion>
      <ngb-panel title="{{course.LocalCourseName}}">
        <ng-template ngbPanelContent>
          <button class="btn btn-success" (click)="open(content, course)">Add Equivalency</button>
          <div *ngIf="course.ForeignCourses.length <= 0">
            No equivalent courses
          </div>
          <table *ngIf="course.ForeignCourses.length > 0">
            <tr>
              <th>Foreign Course</th>
              <th>School</th>
              <th>Status</th>
              <th>Locked By</th>
              <th>Notes</th>
              <th></th>
            </tr>
            <tr *ngFor="let foreignCourse of course.ForeignCourses">
              <td>{{foreignCourse.ForeignCourseName}}</td>
              <td>{{foreignCourse.SchoolName}}</td>
              <td>{{foreignCourse.Status}}</td>
              <td>{{foreignCourse.LockedByUser}}</td>
              <td>{{foreignCourse.Notes}}</td>
              <td>
                <i class="fa fa-pencil-square-o" aria-hidden="true" (click)="edit(content, course, foreignCourse)"></i>
                <i class="fa fa-trash-o" aria-hidden="true" (click)="delete(course, foreignCourse)"></i>
              </td>
            </tr>
          </table>
          <p>Open</p>
        </ng-template>
	    </ngb-panel>
    </ngb-accordion>
    -->
    <!--<p>{{course.LocalCourseName}}</p>-->
    
    <!--
    <p>{{course}}</p>
    -->
    
    <ngb-accordion>
      <ngb-panel title="{{course}}">
        <ng-template ngbPanelContent>
          <button class="btn btn-success" (click)="open(content, rowData)">Add Equivalency</button>
          <div *ngIf="rowData.ForeignCourses.length <= 0">
            No equivalent courses
          </div>
          <table *ngIf="rowData.ForeignCourses.length > 0">
            <tr>
              <th>Foreign Course</th>
              <th>School</th>
              <th>Status</th>
              <th>Locked By</th>
              <th>Notes</th>
              <th></th>
            </tr>
            <tr *ngFor="let foreignCourse of rowData.ForeignCourses">
              <td>{{foreignCourse.ForeignCourseName}}</td>
              <td>{{foreignCourse.SchoolName}}</td>
              <td>{{foreignCourse.Status}}</td>
              <td>{{foreignCourse.LockedByUser}}</td>
              <td>{{foreignCourse.Notes}}</td>
              <td>
                <i class="fa fa-pencil-square-o" aria-hidden="true" (click)="edit(content, course, foreignCourse)"></i>
                <i class="fa fa-trash-o" aria-hidden="true" (click)="delete(course, foreignCourse)"></i>
              </td>
            </tr>
          </table>
        </ng-template>
      </ngb-panel>
    </ngb-accordion>
    
  `,
  styles: [`
    table { width: 100%; }
  `]
})
export class AccordionViewComponent implements ViewCell, OnInit {
  @Input() rowData: any;
  course: string;
  @Input() value: string;
  
  dialogCourse: LocalCourse2;
  dialogInputs = {
	  Mode: "Add Equivalency",
	  SchoolName: "",
	  ForeignCourseName: "",
	  Status: "",
    Lock: "",
	  Notes: ""
  }
  
  ngOnInit(){
    this.course = this.value;
    //console.log(this.value);
  }
}