import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var fs = require('fs');

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
    db.all("select Name from school order by Name asc")
    .then(result => res.json(result));
  })
router.route('/:SchoolName')
  .get((req, res) => {
    console.log(req.params);
    /*
    //console.log(req);
    console.log(req.body);
    console.log(req.body.SchoolName);
    console.log(req.params);
    console.log(req.params.SchoolName);
    */
    db.run(`select * from school where Name=?`, req.params.SchoolName)
    //db.all('select * from school where name='+req.params.SchoolName)
    .then(result => res.json(result));
  });

export var SchoolsRouter = router;
