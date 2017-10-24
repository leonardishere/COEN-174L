import { Injectable } from '@angular/core';
import { School } from './../models/school';
import { SCHOOLS } from './../mock-db/schools';

@Injectable()
export class SchoolService {
  getSchools(): Promise<School[]> {
    return Promise.resolve(SCHOOLS); //TODO: Use HTTP GET to api server
  }
}