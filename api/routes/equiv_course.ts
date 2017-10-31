import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var fs = require('fs');

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
	db.all("select EquivID, Status, LocalCourse.CourseID as LocalCourseID, LocalCourse.Dept||' '||LocalCourse.CourseNum||' - '||LocalCourse.Title as LocalCourseName, ForeignCourse.CourseID as ForeignCourseID, ForeignCourse.Dept||' '||ForeignCourse.CourseNum||' - '||ForeignCourse.Title as ForeignCourseName, School.Name as SchoolName from LocalCourse join EquivCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID) join ForeignCourse on (ForeignCourse.CourseID=EquivCourse.ForeignCourseID) join School on (School.SchoolID=ForeignCourse.SchoolID) order by LocalCourseName asc")
    .then(result => res.json(result));
	//.then(result => {return sendResults(res, result);});
  })
  .post((req, res) => {
    db.run(`INSERT INTO EquivCourse
      (SCUClassID, OtherClassID, Status)
      VALUES (?,?,?)`,
      [req.body.SCUClassID, req.body.OtherClassID, req.body.Status])
    .then(result => res.json({ row: result.stmt.lastID }));
  });
router.route('/:SCUClassID')
  .get((req, res) => {
    db.all(`SELECT * FROM EquivCourse WHERE SCUClassID=?`, req.params.SCUClassID)
    .then(result => res.json(result));
  })
  .put((req, res) => {
    db.run(`UPDATE EquivCourse
      SET OtherClassID=?, Status=?, EquivID=?
      WHERE SCUClassID=?`,
      [req.body.OtherClassID, req.body.Status, req.body.EquivID, req.params.SCUClassID])
    .then(result => res.json({ status: 'OK' }));
  })
  .delete((req, res) => {
    db.run(`DELETE FROM EquivCourse WHERE SCUClassID=?`, req.params.SCUClassID)
    .then(result => res.json({ status: 'OK' }));
  });
router.route('/:LocalCourseName/:SchoolName/:ForeignCourseName')
	.get((req, res) => {
		console.log("get(*)");
		console.log(req.params);
		var cols = ["LocalCourseName", "SchoolName", "ForeignCourseName"];
		var vals = ["", "", ""];
		var set = [true, true, true];
		for(var i = 0; i < cols.length; ++i){
			vals[i] = req.params[cols[i]];
			set[i] = (vals[i] !== 'null' && vals[i] !== "''");
			if(vals[i].charAt(0) !== '\'') vals[i] = "'" + vals[i] + "'";
		}
		var where = "";
		if(set[0]){
			where = "where " + cols[0] + "=" + vals[0];
			if(set[2]){
				where += " and " + cols[2] + "=" + vals[2];
			}else if(set[1]){
				where += " and " + cols[1] + "=" + vals[1];
			}
		}else{
			if(set[2]){
				where += "where " + cols[2] + "=" + vals[2];
			}else if(set[1]){
				where += "where " + cols[1] + "=" + vals[1];
			}
		}
		console.log("where: " + where);
		
		db.all("select EquivID, Status, LocalCourse.CourseID as LocalCourseID, LocalCourse.Dept||' '||LocalCourse.CourseNum||' - '||LocalCourse.Title as LocalCourseName, ForeignCourse.CourseID as ForeignCourseID, ForeignCourse.Dept||' '||ForeignCourse.CourseNum||' - '||ForeignCourse.Title as ForeignCourseName, School.Name as SchoolName from LocalCourse join EquivCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID) join ForeignCourse on (ForeignCourse.CourseID=EquivCourse.ForeignCourseID) join School on (School.SchoolID=ForeignCourse.SchoolID) " + where + " order by LocalCourseName asc")
		.then(result => {
			return sendResults(res, result);
		});
	});
  
function sendResults(res, result){
	var tableID = "justAnotherTable";
	var columnNames = ["SCU Course", "Foreign Course", "School", "Status", "Actions"];
	var columns = ["LocalCourseName", "ForeignCourseName", "SchoolName", "Status"];
	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	res.write("<style>");
	writeFile(res, "resources/tableStyle.css");
	res.write("</style>");
	
	res.write("<script>");
	writeFile(res, "resources/tableSortScript.js");
	res.write("</script>");
	
	res.write("<script>");
	writeFile(res, "resources/equiv_course.js");
	res.write("</script>");
	
	res.write("<p>table is sortable if you click on the header name</p>");
	res.write("<p>autocomplete/autopopulate not yet implemented on form, so type it fully or leave blank</p>");
	res.write("<p>the form involves another call to the server. it would be better if we loaded all the data first, then the form redoes everything from within the page</p>");
	writeFile(res, "resources/equiv_course_form.html");
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
		//actions
		res.write("<td>");
		res.write("<button onclick=\"viewThisEquiv('"+row['LocalCourseName']+"','"+row['SchoolName']+"','"+row['ForeignCourseName']+"')\">View This Course</button>");
		res.write("</td>");
		res.write("</tr>");
	});
	res.write("</table>");
	
	return res.end();
}

function writeFile(res, filename){
	var data = fs.readFileSync(filename, "utf8");
	res.write(data);
}

export var EquivCourseRouter = router;
