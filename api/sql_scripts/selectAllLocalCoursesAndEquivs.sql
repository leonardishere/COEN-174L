select *
from LocalCourse left join EquivCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID) 
left join ForeignCourse on (ForeignCourse.CourseID=EquivCourse.ForeignCourseID)
left join School on (School.SchoolID=ForeignCourse.SchoolID)
;