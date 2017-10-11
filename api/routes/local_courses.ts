import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var fs = require('fs');

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
    //db.all('SELECT * FROM EquivCourse')
	db.all("select EquivID, Status, LocalCourse.CourseID as LocalCourseID, LocalCourse.Dept||' '||LocalCourse.CourseNum||' - '||LocalCourse.Title as LocalCourseName, ForeignCourse.CourseID as ForeignCourseID, ForeignCourse.Dept||' '||ForeignCourse.CourseNum||' - '||ForeignCourse.Title as ForeignCourseName, School.Name as SchoolName from LocalCourse left join EquivCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID) left join ForeignCourse on (ForeignCourse.CourseID=EquivCourse.ForeignCourseID) left join School on (School.SchoolID=ForeignCourse.SchoolID) order by LocalCourseName asc")
    //.then(result => res.json(result));
	.then(result => {
		return sendResults(res, result);
	});
  })
  .post((req, res) => {
    db.run('INSERT INTO EquivCourse (SCUClassID, OtherClassID, Status) VALUES (?,?,?)',
		[req.body.SCUClassID, req.body.OtherClassID, req.body.Status])
		.then(result => res.json({ row: result.stmt.lastID }));
	});
router.route('/:SCUClassID')
  .get((req, res) => {
	db.all('SELECT * FROM EquivCourse WHERE SCUClassID=?', req.params.SCUClassID)
    .then(result => res.json(result));
  })
  .put((req, res) => {
    db.run('UPDATE EquivCourse SET OtherClassID=?, Status=?, EquivID=? WHERE SCUClassID=?',
		[req.body.OtherClassID, req.body.Status, req.body.EquivID, req.params.SCUClassID])
		.then(result => res.json({ status: 'OK' }));
    })
  .delete((req, res) => {
    db.run('DELETE FROM EquivCourse WHERE SCUClassID=?', req.params.SCUClassID)
    .then(result => res.json({ status: 'OK' }));
  });
  
function sendResults(res, result){
	var tableID1 = "mainTable";
	var columnNames1 = ["SCU Course", "Equivalencies"];
	var columnNames2 = ["Foreign Course", "School", "Status"];
	var columns2 = ["ForeignCourseName", "SchoolName", "Status"];
	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	res.write("<p>table is sortable if you click on the header name</p>\n");
	res.write("<table id=\""+tableID1+"\">");
	res.write("<tr>");
	var i = 0;
	columnNames1.forEach((entry) => {
		res.write("<th onclick=\"sortTable('"+tableID1+"',"+i+")\">"+entry+"</th>");
		++i;
	});
	res.write("</tr>");
	
	console.log("begin table parsing");
	var courseID=-1, start=true, innerTableOpen=false;
	result.forEach((row) => {
		//console.log("equality check: " + start || courseID != row['LocalCourseID']);
		//console.log("" + courseID + ", " + row['LocalCourseID']);
		if(start || courseID != row['LocalCourseID']){
			if(innerTableOpen){
				//console.log("close inner table");
				res.write("</table>");
				res.write("</td>");
				res.write("</tr>");
				innerTableOpen = false;
			}
			//console.log("\nbegin new row in main table: " + row['LocalCourseName']);
			courseID = row['LocalCourseID'];
			res.write("<tr>");
			res.write("<td>"+row['LocalCourseName']+"</td>");
			if(row['ForeignCourseID'] === null){
				//console.log("no equivalencies were found");
				res.write("<td>None</td>");
				res.write("</tr>");
				innerTableOpen = false;
			}else{
				//console.log("equivalencies were found. create inner table");
				res.write("<td>");
				var tableID2 = "table"+courseID;
				res.write("<table id=\""+tableID2+"\">");
				res.write("<tr>");
				var i = 0;
				columnNames2.forEach((entry) => {
					res.write("<th onclick=\"sortTable('"+tableID2+"',"+i+")\">"+entry+"</th>");
					++i;
				});
				res.write("</tr>");
				res.write("<tr>");
				//console.log("add to inner table: " + row['ForeignCourseName']);
				columns2.forEach((entry) => {
					res.write("<td>"+row[entry]+"</td>");
				});
				res.write("</tr>");
				innerTableOpen = true;
			}
		}else{
			//console.log("add to inner table: " + row['ForeignCourseName']);
			res.write("<tr>");
			columns2.forEach((entry) => {
				res.write("<td>"+row[entry]+"</td>");
			});
			res.write("</tr>");
			innerTableOpen = true;
		}
		start = false;
	});
	//console.log("end table parsing");
	if(innerTableOpen){
		//console.log("close inner table");
		res.write("</table>");
		res.write("</td>");
		res.write("</tr>");
	}
	//console.log("close main table");
	res.write("</table>\n");
	
	res.write("<script>");
	var filename = "tableSortScript.js";
	var data = fs.readFileSync(filename, "utf8");
	res.write(data);
	res.write("</script>");
	
	return res.end();
}

export var LocalCourseRouter = router;
