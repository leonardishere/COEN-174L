insert into EquivCourse (LocalCourseID, ForeignCourseID, Status) values(9, 115, 'accepted');
insert into Change (EquivID, NewStatus, AdminID, Notes, Date) values(
(select EquivID from EquivCourse where LocalCourseID=9 and ForeignCourseID=115),
'accepted', 0, '', datetime('now', 'localtime')
);