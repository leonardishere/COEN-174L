import { Injectable } from '@angular/core';
import { ChangeJoined } from './../models/change_joined';
import { CHANGES } from './../mock-db/changes';

@Injectable()
export class ChangeService {
  getChanges(): Promise<ChangeJoined[]> {
    return Promise.resolve(CHANGES); //TODO: Use HTTP GET to api server
  }
}