import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var fs = require('fs');

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
	console.log('Get local courses');
	db.all("select EquivID, Status, LocalCourse.CourseID as LocalCourseID, LocalCourse.Dept||' '||LocalCourse.CourseNum||' - '||LocalCourse.Title as LocalCourseName, ForeignCourse.CourseID as ForeignCourseID, ForeignCourse.Dept||' '||ForeignCourse.CourseNum||' - '||ForeignCourse.Title as ForeignCourseName, School.Name as SchoolName from LocalCourse left join EquivCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID) left join ForeignCourse on (ForeignCourse.CourseID=EquivCourse.ForeignCourseID) left join School on (School.SchoolID=ForeignCourse.SchoolID) order by LocalCourseName asc")
	//.then(result => res.json(result));
	//.then(result => {return sendResults2(res, result);});
	.then(result => {return sendResults3(res, result);});
  });
/*
router.route('/:LocalCourseID')
	.get((req, res) => {
		console.log(req.params);
		db.all("select EquivID, Status, LocalCourse.CourseID as LocalCourseID, LocalCourse.Dept||' '||LocalCourse.CourseNum||' - '||LocalCourse.Title as LocalCourseName, ForeignCourse.CourseID as ForeignCourseID, ForeignCourse.Dept||' '||ForeignCourse.CourseNum||' - '||ForeignCourse.Title as ForeignCourseName, School.Name as SchoolName from LocalCourse left join EquivCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID) left join ForeignCourse on (ForeignCourse.CourseID=EquivCourse.ForeignCourseID) left join School on (School.SchoolID=ForeignCourse.SchoolID) where " + req.params.LocalCourseID + " order by LocalCourseName asc")
		.then(result => {
			return sendResults2(res, result);
		});
	});
//router.route('*')
router.route('/:LocalCourseName/:SchoolName/:ForeignCourseName')
	.get((req, res) => {
		console.log("get(*)");
		console.log(req.params);
		db.all("select EquivID, Status, LocalCourse.CourseID as LocalCourseID, LocalCourse.Dept||' '||LocalCourse.CourseNum||' - '||LocalCourse.Title as LocalCourseName, ForeignCourse.CourseID as ForeignCourseID, ForeignCourse.Dept||' '||ForeignCourse.CourseNum||' - '||ForeignCourse.Title as ForeignCourseName, School.Name as SchoolName from LocalCourse left join EquivCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID) left join ForeignCourse on (ForeignCourse.CourseID=EquivCourse.ForeignCourseID) left join School on (School.SchoolID=ForeignCourse.SchoolID) where " + req.params.LocalCourseID + " order by LocalCourseName asc")
		.then(result => {
			return sendResults2(res, result);
		});
	});
*/

function sendResults(res, result){
	var tableID1 = "mainTable";
	var columnNames1 = ["SCU Course", "Equivalencies"];
	var columnNames2 = ["Foreign Course", "School", "Status"];
	var columns2 = ["ForeignCourseName", "SchoolName", "Status"];
	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	res.write("<style>");
	writeFile(res, "tableStyle.css");
	res.write("</style>");
	
	res.write("<script>");
	writeFile(res, "tableSortScript.js");
	res.write("</script>");
	
	res.write("<style>");
	writeFile(res, "accordionStyle.css");
	res.write("</style>");
	
	res.write("<p>table is sortable if you click on the header name</p>\n");
	res.write("<p>warning! this table doesnt behave like it should on sort</p>");
	res.write("<table id=\""+tableID1+"\">");
	res.write("<tr>");
	var i = 0;
	columnNames1.forEach((entry) => {
		res.write("<th onclick=\"sortTable('"+tableID1+"',"+i+")\">"+entry+"</th>");
		++i;
	});
	res.write("</tr>");
	
	//console.log("begin table parsing");
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
	
	writeFile(res, "accordionTest.html");
	
	res.write("<script>");
	writeFile(res, "accordionScript.js");
	res.write("</script>");
	
	
	return res.end();
}

function sendResults2(res, result){
	var tableID1 = "mainTable";
	var columnNames1 = ["SCU Course", "Equivalencies"];
	var columnNames2 = ["Foreign Course", "School", "Status"];
	var columns2 = ["ForeignCourseName", "SchoolName", "Status"];
	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	res.write("<style>");
	writeFile(res, "resources/tableStyle.css");
	res.write("</style>");
	
	res.write("<script>");
	writeFile(res, "resources/tableSortScript.js");
	res.write("</script>");
	
	res.write("<style>");
	writeFile(res, "resources/accordionStyle.css");
	res.write("</style>");
	
	res.write("<p>table is sortable if you click on the header name</p>\n");
	res.write("<p>most of these accordions are empty, but check COEN 210 for an example of what should be in there</p>");
	
	res.write("<div>"); //wrapper
	//console.log("begin table parsing");
	var courseID=-1, start=true, innerTableOpen=false;
	result.forEach((row) => {
		//console.log("equality check: " + start || courseID != row['LocalCourseID']);
		//console.log("" + courseID + ", " + row['LocalCourseID']);
		if(start || courseID != row['LocalCourseID']){
			if(innerTableOpen){
				//console.log("close inner table");
				res.write("</table>");
				res.write("</div>");
				innerTableOpen = false;
			}
			//console.log("\nbegin new row in main table: " + row['LocalCourseName']);
			courseID = row['LocalCourseID'];
			res.write("<button class=\"accordion\">"+row['LocalCourseName']+"</button>");
			res.write("<div class=\"panel\">");
			if(row['ForeignCourseID'] === null){
				//console.log("no equivalencies were found");
				res.write("<p>No equivalencies found</p></div>");
				innerTableOpen = false;
			}else{
				//console.log("equivalencies were found. create inner table");
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
		res.write("</div>");
	}
	res.write("</div>");
	/*
	var filename4 = "accordionTest.html";
	var data4 = fs.readFileSync(filename4, "utf8");
	res.write(data4);
	*/
	res.write("<script>");
	writeFile(res, "resources/accordionScript.js");
	res.write("</script>");
	
	
	return res.end();
}

interface ForeignCourse{
	EquivID: number;
	ForeignCourseID: number;
	ForeignCourseName: string;
	SchoolName: string;
	Status: string;
}

interface LocalCourse{
	LocalCourseID: number;
	LocalCourseName: string;
	ForeignCourses: Array<ForeignCourse>;
}

function sendResults3(res, result){
	var columnNames1 = ["SCU Course", "Equivalencies"];
	var columnNames2 = ["Foreign Course", "School", "Status"];
	var columns2 = ["ForeignCourseName", "SchoolName", "Status"];
	
	var array1 = new Array<LocalCourse>();
	var array2 = new Array<ForeignCourse>();
	var obj1: LocalCourse = {LocalCourseID: 0, LocalCourseName:'',ForeignCourses: new Array<ForeignCourse>()};
	
	//console.log("begin table parsing");
	var courseID=-1, start=true, innerTableOpen=false;
	result.forEach((row) => {
		//console.log("equality check: " + start || courseID != row['LocalCourseID']);
		//console.log("" + courseID + ", " + row['LocalCourseID']);
		if(start || courseID != row['LocalCourseID']){
			//console.log('LocalCourseName: ' + row['LocalCourseName']);
			if(innerTableOpen){
				//console.log("\tclose inner table");
				obj1['ForeignCourses'] = array2;
				array1.push(obj1);
				obj1 = {LocalCourseID: 0, LocalCourseName:'',ForeignCourses: new Array<ForeignCourse>()};
				array2 = new Array<ForeignCourse>();
			}
			//console.log("\nbegin new row in main table: " + row['LocalCourseName']);
			obj1['LocalCourseID'] = row['LocalCourseID'];
			obj1['LocalCourseName'] = row['LocalCourseName'];
			if(row['ForeignCourseID'] === null){
				//console.log("no equivalencies were found");
				obj1['ForeignCourses'] = new Array<ForeignCourse>();
				array1.push(obj1);
				obj1 = {LocalCourseID: 0, LocalCourseName:'',ForeignCourses: new Array<ForeignCourse>()};
				innerTableOpen = false;
			}else{
				//console.log("equivalencies were found. create inner table");
				//console.log("add to inner table: " + row['ForeignCourseName']);
				var obj2: ForeignCourse = {EquivID: 0, ForeignCourseID: 0, ForeignCourseName:'',SchoolName:'',Status:''};
				obj2['EquivID'] = row['EquivID'];
				obj2['ForeignCourseID'] = row['ForeignCourseID'];
				obj2['ForeignCourseName'] = row['ForeignCourseName'];
				obj2['SchoolName'] = row['SchoolName'];
				obj2['Status'] = row['Status'];
				array2.push(obj2);
				innerTableOpen = true;
			}
		}else{
			//console.log("add to inner table: " + row['ForeignCourseName']);
			var obj2: ForeignCourse = {EquivID: 0, ForeignCourseID: 0, ForeignCourseName:'',SchoolName:'',Status:''};
			obj2['EquivID'] = row['EquivID'];
			obj2['ForeignCourseID'] = row['ForeignCourseID'];
			obj2['ForeignCourseName'] = row['ForeignCourseName'];
			obj2['SchoolName'] = row['SchoolName'];
			obj2['Status'] = row['Status'];
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

function writeFile(res, filename){
	var data = fs.readFileSync(filename, "utf8");
	res.write(data);
}

export var LocalCourseRouter = router;
