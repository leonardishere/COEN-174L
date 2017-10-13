import * as PromiseRouter from 'express-promise-router';

var http = require('http');
var url = require('url');
var fs = require('fs');

var router = PromiseRouter();

router.route('/')
	.get((req, res) => {
		res.writeHead(200, {'Content-Type': 'text/html'});
		
		res.write("<style>");
		writeFile(res, "resources/universalStyle.css");
		res.write("</style>");
		
		res.write("<h1>SCU Grad Equiv Checker or whatever the name is</h1>");
		res.write("<h3>Click one of these to access the page</h3>");
		res.write("<a href=\"equiv_course\">Student Page</a><br>");
		res.write("<a href=\"local_courses\">Local Courses</a><br>");
		res.write("<a href=\"schools\">Schools</a><br>");
		res.write("<a href=\"foreign_courses\">Foreign Courses</a><p>//should be accessed through schools</p><br>");
		res.write("<a href=\"users\">Users</a><br>");
		res.write("<a href=\"changes\">Changes</a><br>");
		res.write("<a href=\"recommender\">Recommender</a><p>//I kinda fucked around and made a recommender system based on the names of courses, sorry about that</p><br>");
		//res.write("<a href=\"\"></a><br>");
		return res.end();
	});

function writeFile(res, filename){
	var data = fs.readFileSync(filename, "utf8");
	res.write(data);
}
  
export var EverythingRouter = router;
