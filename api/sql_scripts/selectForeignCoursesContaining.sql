/* replace() is case sensitive. unless there is a case insensitive version, we need to do that part in js */
select CourseID, Dept || " " || CourseNum || " - " || Title as CourseName, '<p>' || replace(Dept || " " || CourseNum || " - " || Title, 'Sys', '<strong>' || 'Sys' || '</strong>') || '</p>' as HTML
from ForeignCourse join School on (ForeignCourse.SchoolID=School.SchoolID)
where School.SchoolID = 18 /*school selector*/
and CourseName like '%' || 'sYs' || '%' /*course selector, case insensitive*/
;