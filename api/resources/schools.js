function viewCourses(schoolName){
	console.log("viewCourses('"+schoolName+"')");
	window.location.href = "/foreign_courses/SchoolName='"+schoolName+"'"; //relative to domain
}

function manageSchool(schoolName){
	console.log("manageSchool('"+schoolName+"')");
}