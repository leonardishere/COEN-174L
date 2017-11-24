import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var fs = require('fs');

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
	db.all("select EquivID, Status, LocalCourse.CourseID as LocalCourseID, LocalCourse.Dept||' '||LocalCourse.CourseNum||' - '||LocalCourse.Title as LocalCourseName, ForeignCourse.CourseID as ForeignCourseID, ForeignCourse.Dept as ForeignCourseDept, ForeignCourse.CourseNum as ForeignCourseNum, ForeignCourse.Title as ForeignCourseTitle, ForeignCourse.Dept||' '||ForeignCourse.CourseNum||' - '||ForeignCourse.Title as ForeignCourseName, School.Name as SchoolName, EquivCourse.LockedBy as LockedBy, User.Name as LockedByUser, Notes from ForeignCourse join School on (School.SchoolID=ForeignCourse.SchoolID) left join EquivCourse on (ForeignCourse.CourseID=EquivCourse.ForeignCourseID) left join LocalCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID) left join User on (EquivCourse.LockedBy=User.UserID) order by SchoolName||ForeignCourseName asc")
	.then(result => {return reformatResults(res, result);});
  })
  .post((req, res) => {
    db.run(`INSERT INTO ForeignCourse (SchoolID, Dept, CourseNum, Title) VALUES (?,?,?,?)`, [req.body.SchoolID, req.body.Dept, req.body.CourseNum, req.body.CourseTitle])
    .then(result => res.json(result));
  });
router.route('/:CourseID')
  .get((req, res) => {
    db.all(`SELECT * FROM ForeignCourse WHERE CourseID=?`, req.params.CourseID)
    .then(result => res.json(result));
  })
  .put((req, res) => {
    db.run(`UPDATE ForeignCourse
      SET Dept=?, CourseNum=?, Title=?, SchoolID=? WHERE CourseID=?`,
      [req.body.Dept, req.body.CourseNum, req.body.Title, req.body.SchoolID, req.params.CourseID])
    .then(result => {console.log(req.body);res.json({ status: 'OK' }); return res;});
  })
  .delete((req, res) => {
    db.run(`DELETE FROM ForeignCourse WHERE CourseID=?`, req.params.CourseID)
    .then(result => {
      db.run(`DELETE FROM EquivCourse WHERE ForeignCourseID=?`, req.params.CourseID)
      .then(result2 => {
        res.json({ status: 'OK' })
      });
    });
  });
  
interface LocalCourse{
	EquivID: number;
	LocalCourseID: number;
	LocalCourseName: string;
	Status: string;
  LockedBy: number;
  LockedByUser: string;
}

interface ForeignCourse{
	ForeignCourseID: number;
  ForeignCourseDept: string;
  ForeignCourseNum: string;
  ForeignCourseTitle: string;
	ForeignCourseName: string;
	SchoolName: string;
	LocalCourses: Array<LocalCourse>;
}

function reformatResults(res, result){
  var cols = ['EquivID', 'LocalCourseID', 'LocalCourseName', 'Status', 'LockedBy', 'LockedByUser', 'Notes'];
  var cols2 = ['ForeignCourseID', 'ForeignCourseDept', 'ForeignCourseNum', 'ForeignCourseTitle', 'ForeignCourseName', 'SchoolName'];
  
	var array1 = new Array<ForeignCourse>();
	var array2 = new Array<LocalCourse>();
	var obj1: ForeignCourse = {ForeignCourseID:-1,ForeignCourseDept:'',ForeignCourseNum:'',ForeignCourseTitle:'',ForeignCourseName:'',SchoolName:'',LocalCourses: new Array<LocalCourse>()};
	
	var courseID=-1, start=true, innerTableOpen=false;
	result.forEach((row) => {
		if(start || courseID != row['ForeignCourseID']){
			if(innerTableOpen){
				obj1['LocalCourses'] = array2;
				array1.push(obj1);
				obj1 = {ForeignCourseID:-1,ForeignCourseDept:'',ForeignCourseNum:'',ForeignCourseTitle:'',ForeignCourseName:'',SchoolName:'',LocalCourses: new Array<LocalCourse>()};
				array2 = new Array<LocalCourse>();
			}
      cols2.forEach(col => {
        obj1[col] = row[col];
      });
			if(row['LocalCourseID'] === null){
				obj1['LocalCourses'] = new Array<LocalCourse>();
				array1.push(obj1);
				obj1 = {ForeignCourseID:-1,ForeignCourseDept:'',ForeignCourseNum:'',ForeignCourseTitle:'',ForeignCourseName:'',SchoolName:'',LocalCourses: new Array<LocalCourse>()};
				innerTableOpen = false;
			}else{
				var obj2: LocalCourse = {EquivID:-1,LocalCourseID:-1,LocalCourseName:'',Status:'', LockedBy:-1, LockedByUser:''};
				cols.forEach((col) => {
					obj2[col] = row[col];
				});
        if(obj2['LockedByUser'] == null) obj2['LockedByUser'] = '';
				array2.push(obj2);
				innerTableOpen = true;
			}
		}else{
			var obj2: LocalCourse = {EquivID:-1,LocalCourseID:-1,LocalCourseName:'',Status:'', LockedBy:-1, LockedByUser:''};
			cols.forEach((col) => {
					obj2[col] = row[col];
			});
      if(obj2['LockedByUser'] == null) obj2['LockedByUser'] = '';
      array2.push(obj2);
			innerTableOpen = true;
		}
		start = false;
		courseID = row['ForeignCourseID'];
	});
	if(innerTableOpen){
		array1.push(obj1);
	}
	
	res.json(array1);
	return res.end();
}

export var ForeignCourseRouter = router;
