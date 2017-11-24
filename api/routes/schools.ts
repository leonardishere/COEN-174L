import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var fs = require('fs');

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
    db.all("select SchoolID, Name from school order by Name asc")
    .then(result => res.json(result));
  });

export var SchoolsRouter = router;
