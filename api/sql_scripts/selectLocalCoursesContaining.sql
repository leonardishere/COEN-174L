select CourseID, Dept || " " || CourseNum || " - " || Title as CourseName from LocalCourse
where CourseName like '%' || 'soft' || '%' 
;