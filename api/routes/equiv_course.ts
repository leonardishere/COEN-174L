import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var fs = require('fs');

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
	db.all("select EquivID, Status, LocalCourse.CourseID as LocalCourseID, LocalCourse.Dept||' '||LocalCourse.CourseNum||' - '||LocalCourse.Title as LocalCourseName, ForeignCourse.CourseID as ForeignCourseID, ForeignCourse.Dept||' '||ForeignCourse.CourseNum||' - '||ForeignCourse.Title as ForeignCourseName, School.Name as SchoolName, LockedBy, User.Name from LocalCourse join EquivCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID) join ForeignCourse on (ForeignCourse.CourseID=EquivCourse.ForeignCourseID) join School on (School.SchoolID=ForeignCourse.SchoolID) left join User on (EquivCourse.LockedBy=User.UserID) order by LocalCourseName asc")
    .then(result => res.json(result));
  })
  .post((req, res) => {
	  db.run(`INSERT INTO School (Name) VALUES (?)`, [req.body.SchoolName])
	  .then(result => result.stmt.lastID)
	  .then(SchoolID =>
	    db.run(`INSERT INTO ForeignCourse (Dept, CourseNum, Title, SchoolID) VALUES (?,?,?,?)`, 
	    ['CMPE', '123', req.body.ForeignCourseName, SchoolID]))
	  .then(result => result.stmt.lastID)
	  .then(ForeignCourseID =>
	    db.run(`INSERT INTO EquivCourse
	      (LocalCourseID, ForeignCourseID, Status, LockedBy, Notes)
	      VALUES (?,?,?,?,?)`,
	      [req.body.LocalCourseID, ForeignCourseID, req.body.Status, req.body.LockedBy, req.body.Notes]))
	  .then(result => res.json({ row: result.stmt.lastID }));
  });
router.route('/:EquivID')
  .get((req, res) => {
    db.all(`SELECT * FROM EquivCourse WHERE EquivID=?`, req.params.EquivID)
    .then(result => res.json(result));
  })
  .put((req, res) => {
    db.run(`UPDATE EquivCourse
      SET Status=?, LockedBy=?, Notes=? WHERE EquivID=?`,
      [req.body.Status, req.body.LockedBy, req.body.Notes, req.params.EquivID])
    .then(result => {console.log(req.body);res.json({ status: 'OK' });});
  })
  .delete((req, res) => {
    db.run(`DELETE FROM EquivCourse WHERE EquivID=?`, req.params.EquivID)
    .then(result => res.json({ status: 'OK' }));
  });

export var EquivCourseRouter = router;
