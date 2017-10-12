function addValue(localCourseID, foreignCourseID, newStatus) {
	var equivs = document.getElementById("equivs");
	var changes = document.getElementById("changes");
	
	var equivsCurrent = equivs.innerHTML;
	var changesCurrent = changes.innerHTML;
	
	var equivsUpdate = equivsCurrent + "<br>(" + localCourseID + ", " + foreignCourseID + ", '" + newStatus + "'),";
	var changesUpdate = changesCurrent + "<br>((select EquivID from EquivCourse where LocalCourseID=" + localCourseID + " and ForeignCourseID=" + foreignCourseID + "),'" + newStatus + "', 0, 'added via recommender system', datetime('now', 'localtime')),";
	
	equivs.innerHTML = equivsUpdate;
	changes.innerHTML = changesUpdate;
	
	var status = document.getElementById("status"+localCourseID+"_"+foreignCourseID);
	status.innerHTML = "to be " + newStatus;
}