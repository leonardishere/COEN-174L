import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var fs = require('fs');

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
	console.log('Get local courses');
	db.all("select EquivID, Status, LocalCourse.CourseID as LocalCourseID, LocalCourse.Dept||' '||LocalCourse.CourseNum||' - '||LocalCourse.Title as LocalCourseName, ForeignCourse.CourseID as ForeignCourseID, ForeignCourse.Dept||' '||ForeignCourse.CourseNum||' - '||ForeignCourse.Title as ForeignCourseName, School.Name as SchoolName, EquivCourse.LockedBy, User.Name as LockedByUser from LocalCourse left join EquivCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID) left join ForeignCourse on (ForeignCourse.CourseID=EquivCourse.ForeignCourseID) left join School on (School.SchoolID=ForeignCourse.SchoolID) left join User on (EquivCourse.LockedBy=User.UserID) order by LocalCourseName asc")
	.then(result => {return reformatResults(res, result);});
  })
  .post((req, res) => {
	  /*
	  db.run(`INSERT INTO School (Name) VALUES (?)`, [req.body.SchoolName])
	  .then(result => result.stmt.lastID)
	  .then(SchoolID =>
	    db.run(`INSERT INTO ForeignCourse (Dept, CourseNum, Title, SchoolID) VALUES (?,?,?,?)`, 
	    ['CMPE', '123', req.body.ForeignCourseName, SchoolID]))
	  .then(result => result.stmt.lastID)
	  .then(ForeignCourseID =>
	    db.run(`INSERT INTO EquivCourse
	      (LocalCourseID, ForeignCourseID, Status)
	      VALUES (?,?,?)`,
	      [req.body.LocalCourseID, ForeignCourseID, req.body.Status]))
	  .then(result => res.json({ row: result.stmt.lastID }));
	  */
	  db.run(`INSERT INTO LocalCourse (Dept, CourseNum, Title) VALUES (?,?,?)`, [req.body.Dept, req.body.CourseNum, req.body.CourseTitle])
	  .then(result => res.json(result));
  });

interface ForeignCourse{
	EquivID: number;
	ForeignCourseID: number;
	ForeignCourseName: string;
	SchoolName: string;
	Status: string;
  LockedBy: number;
  LockedByUser: string;
}

interface LocalCourse{
	LocalCourseID: number;
	LocalCourseName: string;
	ForeignCourses: Array<ForeignCourse>;
}

function reformatResults(res, result){
	var columnNames1 = ["SCU Course", "Equivalencies"];
	var columnNames2 = ["Foreign Course", "School", "Status"];
	var columns2 = ["ForeignCourseName", "SchoolName", "Status"];
	var cols = ['EquivID', 'ForeignCourseID', 'ForeignCourseName', 'SchoolName', 'Status', 'LockedBy', 'LockedByUser'];
	
	var array1 = new Array<LocalCourse>();
	var array2 = new Array<ForeignCourse>();
	var obj1: LocalCourse = {LocalCourseID: 0, LocalCourseName:'',ForeignCourses: new Array<ForeignCourse>()};
	
	var courseID=-1, start=true, innerTableOpen=false;
	result.forEach((row) => {
		if(start || courseID != row['LocalCourseID']){
			if(innerTableOpen){
				obj1['ForeignCourses'] = array2;
				array1.push(obj1);
				obj1 = {LocalCourseID: 0, LocalCourseName:'',ForeignCourses: new Array<ForeignCourse>()};
				array2 = new Array<ForeignCourse>();
			}
			obj1['LocalCourseID'] = row['LocalCourseID'];
			obj1['LocalCourseName'] = row['LocalCourseName'];
			if(row['ForeignCourseID'] === null){
				obj1['ForeignCourses'] = new Array<ForeignCourse>();
				array1.push(obj1);
				obj1 = {LocalCourseID: 0, LocalCourseName:'',ForeignCourses: new Array<ForeignCourse>()};
				innerTableOpen = false;
			}else{
				var obj2: ForeignCourse = {EquivID: 0, ForeignCourseID: 0, ForeignCourseName:'',SchoolName:'',Status:'', LockedBy:-1, LockedByUser:''};
				cols.forEach((col) => {
					obj2[col] = row[col];
				});
        if(obj2['LockedByUser'] == null) obj2['LockedByUser'] = 'null';
				array2.push(obj2);
				innerTableOpen = true;
			}
		}else{
			var obj2: ForeignCourse = {EquivID: 0, ForeignCourseID: 0, ForeignCourseName:'',SchoolName:'',Status:'', LockedBy:0, LockedByUser:''};
			cols.forEach((col) => {
				obj2[col] = row[col];
			});
      if(obj2['LockedByUser'] == null) obj2['LockedByUser'] = 'null';
			array2.push(obj2);
			innerTableOpen = true;
		}
		start = false;
		courseID = row['LocalCourseID'];
	});
	//console.log("end table parsing");
	if(innerTableOpen){
		//console.log("close inner table");
		array1.push(obj1);
	}
	
	res.json(array1);
	return res.end();
}

export var LocalCourseRouter = router;
