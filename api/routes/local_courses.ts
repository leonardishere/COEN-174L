import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var fs = require('fs');

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
	db.all("select EquivID, Status, LocalCourse.CourseID as LocalCourseID, LocalCourse.Dept as LocalCourseDept, LocalCourse.CourseNum as LocalCourseNum, LocalCourse.Title as LocalCourseTitle, LocalCourse.Dept||' '||LocalCourse.CourseNum||' - '||LocalCourse.Title as LocalCourseName, ForeignCourse.CourseID as ForeignCourseID, ForeignCourse.Dept||' '||ForeignCourse.CourseNum||' - '||ForeignCourse.Title as ForeignCourseName, School.Name as SchoolName, EquivCourse.LockedBy, User.Name as LockedByUser, Notes from LocalCourse left join EquivCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID) left join ForeignCourse on (ForeignCourse.CourseID=EquivCourse.ForeignCourseID) left join School on (School.SchoolID=ForeignCourse.SchoolID) left join User on (EquivCourse.LockedBy=User.UserID) order by LocalCourseName asc, SchoolName asc, ForeignCourseName asc")
	.then(result => {return reformatResults(res, result);});
  })
  .post((req, res) => {
	  db.run(`INSERT INTO LocalCourse (Dept, CourseNum, Title) VALUES (?,?,?)`, [req.body.Dept, req.body.CourseNum, req.body.CourseTitle])
	  .then(result => res.json(result));
  });
router.route('/:CourseID')
  .get((req, res) => {
    db.all(`SELECT * FROM LocalCourse WHERE CourseID=?`, req.params.CourseID)
    .then(result => res.json(result));
  })
  .put((req, res) => {
    db.run(`UPDATE LocalCourse
      SET Dept=?, CourseNum=?, Title=? WHERE CourseID=?`,
      [req.body.Dept, req.body.CourseNum, req.body.CourseTitle, req.params.CourseID])
    .then(result => {console.log(req.body);res.json({ status: 'OK' });});
  })
  .delete((req, res) => {
    db.run(`DELETE FROM LocalCourse WHERE CourseID=?`, req.params.CourseID)
    .then(result => {
      db.run(`DELETE FROM EquivCourse WHERE LocalCourseID=?`, req.params.CourseID)
      .then(result2 => {
        res.json({ status: 'OK' })
      });
    });
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
  LocalCourseDept: string;
  LocalCourseNum: string;
  LocalCourseTitle: string;
	LocalCourseName: string;
	ForeignCourses: Array<ForeignCourse>;
}

function reformatResults(res, result){
	var columnNames1 = ["SCU Course", "Equivalencies"];
	var columnNames2 = ["Foreign Course", "School", "Status"];
	var columns2 = ["ForeignCourseName", "SchoolName", "Status"];
	var cols = ['EquivID', 'ForeignCourseID', 'ForeignCourseName', 'SchoolName', 'Status', 'LockedBy', 'LockedByUser', 'Notes'];
  var cols1 = ['LocalCourseID', 'LocalCourseDept', 'LocalCourseNum', 'LocalCourseTitle', 'LocalCourseName'];
	
	var array1 = new Array<LocalCourse>();
	var array2 = new Array<ForeignCourse>();
	var obj1: LocalCourse = {LocalCourseID: 0, LocalCourseDept:'', LocalCourseNum:'', LocalCourseTitle:'', LocalCourseName:'',ForeignCourses: new Array<ForeignCourse>()};
	
	var courseID=-1, start=true, innerTableOpen=false;
	result.forEach((row) => {
		if(start || courseID != row['LocalCourseID']){
			if(innerTableOpen){
				obj1['ForeignCourses'] = array2;
				array1.push(obj1);
				obj1 = {LocalCourseID: 0, LocalCourseDept:'', LocalCourseNum:'', LocalCourseTitle:'', LocalCourseName:'',ForeignCourses: new Array<ForeignCourse>()};
				array2 = new Array<ForeignCourse>();
			}
      cols1.forEach(col => {
        obj1[col] = row[col];
      });
			if(row['ForeignCourseID'] === null){
				obj1['ForeignCourses'] = new Array<ForeignCourse>();
				array1.push(obj1);
				obj1 = {LocalCourseID: 0, LocalCourseDept:'', LocalCourseNum:'', LocalCourseTitle:'', LocalCourseName:'',ForeignCourses: new Array<ForeignCourse>()};
				innerTableOpen = false;
			}else{
				var obj2: ForeignCourse = {EquivID: 0, ForeignCourseID: 0, ForeignCourseName:'',SchoolName:'',Status:'', LockedBy:-1, LockedByUser:''};
				cols.forEach((col) => {
					obj2[col] = row[col];
				});
        if(obj2['LockedByUser'] == null) obj2['LockedByUser'] = '';
				array2.push(obj2);
				innerTableOpen = true;
			}
		}else{
			var obj2: ForeignCourse = {EquivID: 0, ForeignCourseID: 0, ForeignCourseName:'',SchoolName:'',Status:'', LockedBy:0, LockedByUser:''};
			cols.forEach((col) => {
				obj2[col] = row[col];
			});
      if(obj2['LockedByUser'] == null) obj2['LockedByUser'] = '';
			array2.push(obj2);
			innerTableOpen = true;
		}
		start = false;
		courseID = row['LocalCourseID'];
	});
	if(innerTableOpen){
		array1.push(obj1);
	}
	
	res.json(array1);
	return res.end();
}

export var LocalCourseRouter = router;
