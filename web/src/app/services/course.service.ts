import { Injectable } from '@angular/core';
import { LocalCourse } from '../models/local_course';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CourseService {
  constructor(private http: HttpClient) {}

  getLocalCourses(): Promise<any> {
    return this.http.get(environment.api + 'local_courses').toPromise();
  }
}
