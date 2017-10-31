import * as express from 'express';
import * as passport from 'passport';
import * as bodyparser from 'body-parser';
import * as cors from 'cors';

import { AuthRouter } from './routes/auth';
import { EquivCourseRouter } from './routes/equiv_course';
import { StudentLocalCourseRouter } from './routes/student_local_courses';
import { FileServerRouter } from './routes/file_server_test';
import { LocalCourseRouter } from './routes/local_courses';
import { RecommenderRouter } from './routes/recommender';
import { UsersRouter } from './routes/users';
import { SchoolsRouter } from './routes/schools';
import { ForeignCourseRouter } from './routes/foreign_courses';
import { ChangesRouter } from './routes/changes';
import { EverythingRouter } from './routes/index';

var app = express();
//app.use(express.session({ secret: 'keyboard cat' }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use('/auth', AuthRouter);
app.use('/equiv_course', EquivCourseRouter);
//Add more routes here
app.use('/student_local_courses', StudentLocalCourseRouter);
app.use('/file_server_test', FileServerRouter);
app.use('/local_courses', LocalCourseRouter);
app.use('/recommender', RecommenderRouter);
app.use('/users', UsersRouter);
app.use('/schools', SchoolsRouter);
app.use('/foreign_courses', ForeignCourseRouter);
app.use('/changes', ChangesRouter);
app.use('/favicon.ico', (req, res, next) => { console.log("look who it is, another damn favicon.ico warning"); });
app.use('/', EverythingRouter);

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
