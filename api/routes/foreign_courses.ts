import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var fs = require('fs');

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
	db.all("select EquivID, Status, LocalCourse.CourseID as LocalCourseID, LocalCourse.Dept||' '||LocalCourse.CourseNum||' - '||LocalCourse.Title as LocalCourseName, ForeignCourse.CourseID as ForeignCourseID, ForeignCourse.Dept||' '||ForeignCourse.CourseNum||' - '||ForeignCourse.Title as ForeignCourseName, School.Name as SchoolName, EquivCourse.LockedBy, User.Name as LockedByUser from ForeignCourse join School on (School.SchoolID=ForeignCourse.SchoolID) left join EquivCourse on (ForeignCourse.CourseID=EquivCourse.ForeignCourseID) left join LocalCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID) left join User on (EquivCourse.LockedBy=User.UserID) order by ForeignCourseName asc")
	.then(result => {return reformatResults(res, result);});
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
	ForeignCourseName: string;
	SchoolName: string;
	LocalCourses: Array<LocalCourse>;
}

function reformatResults(res, result){
  var cols = ['EquivID', 'LocalCourseID', 'LocalCourseName', 'Status', 'LockedBy', 'LockedByUser'];
  
	var array1 = new Array<ForeignCourse>();
	var array2 = new Array<LocalCourse>();
	var obj1: ForeignCourse = {ForeignCourseID:0,ForeignCourseName:'',SchoolName:'',LocalCourses: new Array<LocalCourse>()};
	
	var courseID=-1, start=true, innerTableOpen=false;
	result.forEach((row) => {
		if(start || courseID != row['LocalCourseID']){
			if(innerTableOpen){
				obj1['LocalCourses'] = array2;
				array1.push(obj1);
				obj1 = {ForeignCourseID:0,ForeignCourseName:'',SchoolName:'',LocalCourses: new Array<LocalCourse>()};
				array2 = new Array<LocalCourse>();
			}
			obj1['ForeignCourseName'] = row['ForeignCourseName'];
			obj1['SchoolName'] = row['SchoolName'];
			if(row['LocalCourseID'] === null){
				obj1['LocalCourses'] = new Array<LocalCourse>();
				array1.push(obj1);
				obj1 = {ForeignCourseID:0,ForeignCourseName:'',SchoolName:'',LocalCourses: new Array<LocalCourse>()};
				innerTableOpen = false;
			}else{
				var obj2: LocalCourse = {EquivID:0,LocalCourseID:0,LocalCourseName:'',Status:'', LockedBy:-1, LockedByUser:''};
				cols.forEach((col) => {
					obj2[col] = row[col];
				});
        if(obj2['LockedByUser'] == null) obj2['LockedByUser'] = 'null';
				array2.push(obj2);
				innerTableOpen = true;
			}
		}else{
			var obj2: LocalCourse = {EquivID:0,LocalCourseID:0,LocalCourseName:'',Status:'', LockedBy:-1, LockedByUser:''};
			cols.forEach((col) => {
					obj2[col] = row[col];
			});
      if(obj2['LockedByUser'] == null) obj2['LockedByUser'] = 'null';
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
