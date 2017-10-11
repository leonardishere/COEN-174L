import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var fs = require('fs');

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
	db.all("select EquivID, Status, LocalCourse.CourseID as LocalCourseID, LocalCourse.Dept||' '||LocalCourse.CourseNum||' - '||LocalCourse.Title as LocalCourseName, ForeignCourse.CourseID as ForeignCourseID, ForeignCourse.Dept||' '||ForeignCourse.CourseNum||' - '||ForeignCourse.Title as ForeignCourseName, School.Name as SchoolName from LocalCourse join EquivCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID) join ForeignCourse on (ForeignCourse.CourseID=EquivCourse.ForeignCourseID) join School on (School.SchoolID=ForeignCourse.SchoolID) order by LocalCourseName asc")
	.then(result => {
		return sendResults(res, result);
	});
  });
  
function sendResults(res, result){
	var tableID = "justAnotherTable";
	var columnNames = ["LocalCourseID", "ForeignCourseID", "SCU Course", "Foreign Course", "School", "Status", "Similarity (%)", "Actions"];
	var columns = ["LocalCourseID", "ForeignCourseID", "LocalCourseName", "ForeignCourseName", "SchoolName", "Status" /*, similarity ,actions*/];
	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	res.write("<script>");
	var filename = "tableSortScript.js";
	var data = fs.readFileSync(filename, "utf8");
	res.write(data);
	res.write("</script>");
	
	res.write("<script>");
	var filename2 = "recommenderAddValueScript.js";
	var data2 = fs.readFileSync(filename2, "utf8");
	res.write(data2);
	res.write("</script>");
	
	res.write("<p>table is sortable if you click on the header name</p>");
	res.write("<p id=\"equivs\">insert into EquivCourse (LocalCourseID, ForeignCourseID, Status) values</p>");
	res.write("<p id=\"changes\">insert into Changes (EquivID, NewStatus, AdminID, Notes, Date) values</p>");
	res.write("<br>");
	res.write("<table id=\""+tableID+"\">");
	res.write("<tr>");
	var i = 0;
	columnNames.forEach((entry) => {
		res.write("<th onclick=\"sortTable('"+tableID+"',"+i+")\">"+entry+"</th>");
		++i;
	});
	res.write("</tr>");
	result.forEach((row) => {
		res.write("<tr>");
		columns.forEach((entry) => {
			res.write("<td>"+row[entry]+"</td>");
		});
		//similarity
		res.write("<td>unknown</td>");
		//actions
		res.write("<td>");
		res.write("<button onclick=\"addValue(" + row['LocalCourseID'] + "," + row['ForeignCourseID'] + "," + "'accepted'" + ")\">accept</button>");
		res.write("<button onclick=\"addValue(" + row['LocalCourseID'] + "," + row['ForeignCourseID'] + "," + "'rejected'" + ")\">reject</button>"); 
		res.write("</td>");
		res.write("</tr>");
	});
	res.write("</table>");
	
	return res.end();
}

export var RecommenderRouter = router;
