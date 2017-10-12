import * as express from 'express';
import * as bodyparser from 'body-parser';

import { EquivCourseRouter } from './routes/equiv_course';
import { StudentLocalCourseRouter } from './routes/student_local_courses';
import { FileServerRouter } from './routes/file_server_test';
import { LocalCourseRouter } from './routes/local_courses';
import { RecommenderRouter } from './routes/recommender';
import { UsersRouter } from './routes/users';

var app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use('/equiv_course', EquivCourseRouter);
//Add more routes here
app.use('/student_local_courses', StudentLocalCourseRouter);
app.use('/file_server_test', FileServerRouter);
app.use('/local_courses', LocalCourseRouter);
app.use('/recommender', RecommenderRouter);
app.use('/users', UsersRouter);
app.use('/favicon.ico', (req, res, next) => {
	console.log("look who it is, another damn favicon.ico warning");
});

app.use('*', (req, res, next) => {
  next({ err: 'Unknown route' });
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500);
  res.json(err);
});

var port = parseInt(process.env.PORT || "3000");
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
