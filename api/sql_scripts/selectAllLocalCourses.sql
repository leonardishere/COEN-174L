/* select all courses */
select * from LocalCourse;

/* select course descriptions */
select CourseID, Dept || " " || CourseNum || " - " || Title as CourseName from LocalCourse;