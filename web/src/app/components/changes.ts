import { Component, OnInit } from '@angular/core';
import { ChangeJoined } from './../models/change_joined';
import { ChangeService } from './../services/changes';

@Component({
	selector: 'changes',
	template: `
		<h1>Changes</h1>
		<table>
			<tr>
				<th>Local Course</th>
				<th>Foreign Course</th>
				<th>School</th>
				<th>Status</th>
				<th>Notes</th>
				<th>Date</th>
				<th>User Name</th>
				<th>User Email</th>
			</tr>
			<tr *ngFor="let change of changes" (click)="onSelect(change)">
				<td>{{change.LocalCourseName}}</td>
				<td>{{change.ForeignCourseName}}</td>
				<td>{{change.SchoolName}}</td>
				<td>{{change.NewStatus}}</td>
				<td>{{change.Notes}}</td>
				<td>{{change.Date}}</td>
				<td>{{change.UserName}}</td>
				<td>{{change.UserEmail}}</td>
	`,
	styles: [``]
})
export class ChangeComponent implements OnInit {
  changes: ChangeJoined[];

  constructor(private changeService: ChangeService) { }

  ngOnInit(): void {
    this.changeService.getChanges().then(changes =>
      this.changes = changes
    );
  }

  onSelect(change: ChangeJoined): void {
    console.log('Selected', change);
  }
}