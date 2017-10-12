import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var fs = require('fs');

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
	db.all("select EquivID, Status, LocalCourse.CourseID as LocalCourseID, LocalCourse.Title as LocalCourseTitle, LocalCourse.Dept||' '||LocalCourse.CourseNum||' - '||LocalCourse.Title as LocalCourseName, ForeignCourse.CourseID as ForeignCourseID, ForeignCourse.Title as ForeignCourseTitle, ForeignCourse.Dept||' '||ForeignCourse.CourseNum||' - '||ForeignCourse.Title as ForeignCourseName, School.Name as SchoolName from LocalCourse join ForeignCourse join School on (ForeignCourse.SchoolID=School.SchoolID) left join EquivCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID and ForeignCourse.CourseID=EquivCourse.ForeignCourseID) order by LocalCourseName asc")
	.then(result => {
		return sendResults(res, result);
	});
  });
  
function sendResults(res, result){
	var tableID = "justAnotherTable";
	var columnNames = ["LID", "FID", "SCU Course", "Foreign Course", "School", "Status", "Similarity (%)", "Actions"];
	var columns = ["LocalCourseID", "ForeignCourseID", "LocalCourseName", "ForeignCourseName", "SchoolName"/*, "Status"*/ /*,actions*/];
	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	res.write("<style>");
	var filename0 = "tableStyle.css";
	var data0 = fs.readFileSync(filename0, "utf8");
	res.write(data0);
	res.write("</style>");
	
	res.write("<script>");
	var filename1 = "tableSortScript.js";
	var data1 = fs.readFileSync(filename1, "utf8");
	res.write(data1);
	res.write("</script>");
	
	res.write("<script>");
	var filename2 = "recommenderAddValueScript.js";
	var data2 = fs.readFileSync(filename2, "utf8");
	res.write(data2);
	res.write("</script>");
	
	res.write("<p>table is sortable if you click on the header name</p>");
	res.write("<p>click accept or reject to add a row into the below statements<br>and yes, this should be a post command, but screw it</p>");
	res.write("<p id=\"equivs\">insert into EquivCourse (LocalCourseID, ForeignCourseID, Status) values</p>");
	res.write("<p id=\"changes\">insert into Change (EquivID, NewStatus, AdminID, Notes, Date) values</p>");
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
		var similarity = 100*calculateSimilarity(row['LocalCourseTitle'], row['ForeignCourseTitle']);
		if(similarity >= 50){
			var similarityString = ""+Math.round(similarity);
			if(similarityString.length == 2) similarityString = " " + similarityString;
			//printTokens(row['LocalCourseTitle'], row['ForeignCourseTitle']);
			res.write("<tr>");
			columns.forEach((entry) => {
				res.write("<td>"+row[entry]+"</td>");
			});
			//status
			res.write("<td id=\"status"+row['LocalCourseID']+"_"+row['ForeignCourseID']+"\">"+row['Status']+"</td>");
			//similarity
			res.write("<td>"+similarityString+"</td>");
			//actions
			res.write("<td>");
			res.write("<button onclick=\"addValue(" + row['LocalCourseID'] + "," + row['ForeignCourseID'] + "," + "'accepted'" + ")\">accept</button>");
			res.write("<button onclick=\"addValue(" + row['LocalCourseID'] + "," + row['ForeignCourseID'] + "," + "'rejected'" + ")\">reject</button>"); 
			res.write("</td>");
			res.write("</tr>");
		}
	});
	res.write("</table>");
	
	return res.end();
}

function calculateSimilarity(string1, string2){
	var tokens1 = smartSplit(string1);
	var tokens2 = smartSplit(string2);
	var tokens3 = tokens1.slice();
	for(var i = 0; i < tokens2.length; ++i){
		if(tokens3.indexOf(tokens2[i]) === -1) tokens3.push(tokens2[i]);
	}
	tokens3.sort();
	//console.log("tokens1: " + tokens1);
	//console.log("tokens2: " + tokens2);
	//console.log("tokens3: " + tokens3);
	
	var dotProduct = 0, length1 = 0, length2 = 0;
	for(var i = 0; i < tokens3.length; ++i){
		dotProduct += ((tokens1.indexOf(tokens3[i]) === -1 ? 0 : 1) * (tokens2.indexOf(tokens3[i]) === -1 ? 0 : 1));
		length1 += (tokens1.indexOf(tokens3[i]) === -1 ? 0 : 1);
		length2 += (tokens2.indexOf(tokens3[i]) === -1 ? 0 : 1);
	}
	if(length1 === 0 || length2 === 0) return 0.0;
	return dotProduct / (Math.sqrt(length1) * Math.sqrt(length2));
}

function printTokens(string1, string2){
	var tokens1 = smartSplit(string1);
	var tokens2 = smartSplit(string2);
	var tokens3 = tokens1.slice();
	for(var i = 0; i < tokens2.length; ++i){
		if(tokens3.indexOf(tokens2[i]) === -1) tokens3.push(tokens2[i]);
	}
	tokens3.sort();
	console.log("" + tokens1 + " + " + tokens2 + " = " + tokens3);
}

function smartSplit(string){
	var regices1 = [/\-/g, /&/g, /\[/g, /\]/g, /\(/g, /\)/g, /\{/g, /\}/g, /\\/g, /\//g, /,/g]; //plural of regex?
	var regices2 = [/'/g, /\./g];
	
	var string2 = string;
	regices1.forEach((regex) => {
		string2 = string2.replace(regex, " ");
	});
	regices2.forEach((regex) => {
		string2 = string2.replace(regex, "");
	});
	
	var tokens = string2.split(/\s+/);
	for(var i = 0; i < tokens.length; ++i){
		tokens[i] = tokens[i].toLowerCase();
	}
	
	var stopwords = ["a","about","above","after","again","against","all","am","an","and","any","are","arent","as","at","be","because","been","before","being","below","between","both","but","by","cannot","cant","could","couldnt","did","didnt","do","does","doesnt","doing","dont","down","during","each","few","for","from","further","had","hadnt","has","hasnt","have","havent","having","he","hed","hell","her","here","heres","hers","herself","hes","him","himself","his","how","hows","i","id","if","ill","im","in","into","is","isnt","it","its","its","itself","ive","lets","me","more","most","mustnt","my","myself","no","nor","not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same","shant","she","shed","shell","shes","should","shouldnt","so","some","such","than","that","thats","the","their","theirs","them","themselves","then","there","theres","these","they","theyd","theyll","theyre","theyve","this","those","through","to","too","under","until","up","very","was","wasnt","we","wed","well","were","were","werent","weve","what","whats","when","whens","where","wheres","which","while","who","whom","whos","why","whys","with","wont","would","wouldnt","you","youd","youll","your","youre","yours","yourself","yourselves","youve"];
	stopwords.forEach((word) => {
		var found = true;
		while(found){
			var index = tokens.indexOf(word);
			if(index === -1) found = false;
			else{
				//console.log("\ntokens: " + tokens);
				//console.log("found '" + word + "' at index " + index);
				tokens.splice(index, 1);
				//console.log("tokens: " + tokens);
			}
		}
	});
	if(tokens.length === 0){
		//console.log("return tokens array with length 0");
		return tokens;
	}
	tokens.sort();
	var tokens2 = [tokens[0]]; //smh this really makes a difference?
	//tokens.forEach((token) => {
	for(var i = 0; i < tokens.length; ++i){
		var token = tokens[i];
		if(tokens2.indexOf(token) === -1){
			tokens2.push(token);
		}
	}
	return tokens2;
}

export var RecommenderRouter = router;
