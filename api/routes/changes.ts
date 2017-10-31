import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var fs = require('fs');

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
	//db.all("select * from Change join User on UserID=AdminID")
	db.all("select LocalCourse.Dept||\" \"||LocalCourse.CourseNum||\" - \"||LocalCourse.Title as LocalCourseName, ForeignCourse.Dept||\" \"||ForeignCourse.CourseNum||\" - \"||ForeignCourse.Title as ForeignCourseName, School.Name as SchoolName, NewStatus, Notes, Date, User.Name as UserName, User.Email as UserEmail from LocalCourse join EquivCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID) join ForeignCourse on (ForeignCourse.CourseID=EquivCourse.ForeignCourseID) join School on (School.SchoolID=ForeignCourse.SchoolID) join Change on (EquivCourse.EquivID=Change.EquivID) join User on (Change.AdminID=User.UserID) order by Date desc")
	.then(result => res.json(result));
	//.then(result => {return sendResults(res, result);});
  });
	
function sendResults(res, result){
	var tableID = "justAnotherTable";
	var columnNames = ["NewStatus", "Admin", "Notes", "Date"];
	var columns = ["NewStatus", "Name", "Notes", "Date"];
	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	res.write("<style>");
	writeFile(res, "resources/tableStyle.css");
	res.write("</style>");
	
	res.write("<script>");
	writeFile(res, "resources/tableSortScript.js");
	res.write("</script>");
	
	res.write("<script>");
	writeFile(res, "resources/schools.js");
	res.write("</script>");
	
	res.write("<p>table is sortable if you click on the header name</p>");
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
	});
	res.write("</table>");
	
	return res.end();
}

function writeFile(res, filename){
	var data = fs.readFileSync(filename, "utf8");
	res.write(data);
}

export var ChangesRouter = router;
