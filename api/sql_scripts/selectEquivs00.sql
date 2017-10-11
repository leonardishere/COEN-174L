/* select all equivalent courses */
select EquivID, Status, LocalCourse.CourseID as LocalCourseId, LocalCourse.Dept||" "||LocalCourse.CourseNum||" - "||LocalCourse.Title as LocalCourseName, ForeignCourse.CourseID as ForeignCourseID, ForeignCourse.Dept||" "||ForeignCourse.CourseNum||" - "||ForeignCourse.Title as ForeignCourseName
from LocalCourse join EquivCourse on (LocalCourse.CourseID=EquivCourse.LocalCourseID) join ForeignCourse on (ForeignCourse.CourseID=EquivCourse.ForeignCourseID)
/*where LocalCourseID = LocalCourse.CourseID and ForeignCourseID = ForeignCourse.CourseID*/
;