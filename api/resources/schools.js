function viewCourses(schoolName){
	console.log("viewCourses('"+schoolName+"')");
	
}

function manageSchool(schoolName){
	console.log("manageSchool('"+schoolName+"')");
	window.location.href = "/foreign_courses/SchoolName='"+schoolName+"'"; //relative to domain
	//http://localhost:3000/local_courses/LocalCourseID=(select%20CourseID%20from%20LocalCourse%20where%20Title='Computer%20Architecture')
}