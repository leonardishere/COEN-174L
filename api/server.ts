import * as express from 'express';
import * as passport from 'passport';
import * as bodyparser from 'body-parser';
import * as cors from 'cors';

import { AuthRouter } from './routes/auth';
import { EquivCourseRouter } from './routes/equiv_course';
import { LocalCourseRouter } from './routes/local_courses';
import { RecommenderRouter } from './routes/recommender';
import { UsersRouter } from './routes/users';
import { SchoolsRouter } from './routes/schools';
import { ForeignCourseRouter } from './routes/foreign_courses';
import { EverythingRouter } from './routes/index';
import { LocalCoursePlainRouter } from './routes/local_courses_plain';
import { ForeignCourseSchoolRouter } from './routes/foreign_courses_schools';
import { ResetDbRouter } from './routes/reset_db';

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
app.use('/local_courses', LocalCourseRouter);
app.use('/recommender', RecommenderRouter);
app.use('/users', UsersRouter);
app.use('/schools', SchoolsRouter);
app.use('/foreign_courses', ForeignCourseRouter);
app.use('/', EverythingRouter);
app.use('/local_courses_plain', LocalCoursePlainRouter);
app.use('/foreign_courses_schools', ForeignCourseSchoolRouter);
//app.use('/reset_db', ResetDbRouter);
app.use('/favicon.ico', (req, res) => console.log('another favicon.ico warning'));

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
