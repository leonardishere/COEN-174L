import * as express from 'express';
import * as bodyparser from 'body-parser';

import { EquivalentClassesRouter } from './routes/equivalent_classes';

var app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use('/equivalent_classes', EquivalentClassesRouter);
//Add more routes here

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
