/* select all equivalent courses */
select EquivID, Status, LocalCourse.CourseID as LocalCourseId, LocalCourse.Dept||" "||LocalCourse.CourseNum||" - "||LocalCourse.Title as LocalCourseName, ForeignCourse.CourseID as ForeignCourseID, ForeignCourse.Dept||" "||ForeignCourse.CourseNum||" - "||ForeignCourse.Title as ForeignCourseName, School.Name as SchoolName
from LocalCourse join EquivCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID) join ForeignCourse on (ForeignCourse.CourseID=EquivCourse.ForeignCourseID) join School on (School.SchoolID=ForeignCourse.SchoolID)
/*where LocalCourseID = LocalCourse.CourseID and ForeignCourseID = ForeignCourse.CourseID*/
;