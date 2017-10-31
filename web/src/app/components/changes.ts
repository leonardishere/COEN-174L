import { Component, OnInit } from '@angular/core';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { ChangeJoined } from './../models/change_joined';
import { ChangeService } from './../services/changes';

@Component({
	selector: 'changes',
	template: `
		<h1>Changes</h1>
		<ng2-smart-table
      [settings]="settings"
      [source]="source">
    </ng2-smart-table>
	`,
	styles: [``]
})
export class ChangeComponent implements OnInit {
  changes: ChangeJoined[];
	source: LocalDataSource;
	settings = {
    columns: {
      LocalCourseName: { title: 'Local Course' },
      ForeignCourseName: { title: 'Foreign Course' },
      SchoolName: { title: 'School' },
			NewStatus: { title: 'Status' },
			Notes: { title: 'Notes' },
			Date: { title: 'Date' },
			UserName: { title: 'User name'},
			UserEmail: { title: 'User email'}
    },
    pager: {
			perPage: 100
		}
  };

  constructor(private changeService: ChangeService) { }

  ngOnInit(): void {
    this.changeService.getChanges().then(changes => {
      this.changes = changes;
			this.source = new LocalDataSource(this.changes);
    });
  }

  onSelect(change: ChangeJoined): void {
    console.log('Selected', change);
  }
}
