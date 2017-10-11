import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
    //db.all('SELECT * FROM EquivCourse')
	db.all("select EquivID, Status, LocalCourse.CourseID as LocalCourseId, LocalCourse.Dept||' '||LocalCourse.CourseNum||' - '||LocalCourse.Title as LocalCourseName, ForeignCourse.CourseID as ForeignCourseID, ForeignCourse.Dept||' '||ForeignCourse.CourseNum||' - '||ForeignCourse.Title as ForeignCourseName, School.Name as SchoolName from LocalCourse join EquivCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID) join ForeignCourse on (ForeignCourse.CourseID=EquivCourse.ForeignCourseID) join School on (School.SchoolID=ForeignCourse.SchoolID) order by LocalCourseName asc")
    //.then(result => res.json(result));
	.then(result => {
		return sendResults(res, result);
	});
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
  
function sendResults(res, result){
	var columnNames = ["SCU Course", "Foreign Course", "School", "Status"];
	var columns = ["LocalCourseName", "ForeignCourseName", "SchoolName", "Status"];
	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	res.write("<table>");
	res.write("<tr>");
	columnNames.forEach((entry) => {
		res.write("<th>"+entry+"</th>");
	});
	res.write("</tr>");
	result.forEach((row) => {
		res.write("<tr>");
		columns.forEach((entry) => {
			res.write("<td>"+row[entry]+"</td>");
		});
		res.write("</tr>");
	});
	res.write("</table>");
	return res.end();
}

export var EquivCourseRouter = router;
