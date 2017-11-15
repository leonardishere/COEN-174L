import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var fs = require('fs');

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
	db.all("select ForeignCourse.Dept||' '||ForeignCourse.CourseNum||' - '||ForeignCourse.Title as ForeignCourseName, School.Name as SchoolName from ForeignCourse join School on (ForeignCourse.SchoolID=School.SchoolID) order by SchoolName asc, ForeignCourseName asc;")
	.then(result => res.json(result));
  });

export var ForeignCourseSchoolRouter = router;
