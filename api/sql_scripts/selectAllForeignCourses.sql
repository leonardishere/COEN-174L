/* select all courses*/
/* select * from ForeignCourse; */

/* select all courses and display school name */
/* theres better ways to do the join so the where clause isnt needed */
select CourseID, Dept || " " || CourseNum || " - " || Title as CourseName, Name as SchoolName from ForeignCourse join School /*on School.SchoolID*/
where ForeignCourse.SchoolID = School.SchoolId
/*order by CourseName asc*/
;