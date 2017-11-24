import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var fs = require('fs');

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
	db.all("select CourseID as LocalCourseID, LocalCourse.Dept||' '||LocalCourse.CourseNum||' - '||LocalCourse.Title as LocalCourseName from LocalCourse order by LocalCourseName asc")
	.then(result => res.json(result));
  });

export var LocalCoursePlainRouter = router;
